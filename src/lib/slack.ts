import { WebClient } from '@slack/web-api';
import { emojify } from 'node-emoji';
import { parseChannelName, parseMessage } from './parse';
import { formatRelativeDate } from './date';
import type { CardItem } from './types';

// Matches fb-[team]-[nome]-[cognome] (individual) or fb-[team]-team (team channel)
const CHANNEL_PATTERN = /^fb-[^-]+(-[^-]+-[^-]+|-team)$/;

interface SlackMessage {
  ts: string;
  text: string;
  type: string;
  subtype?: string;
  thread_ts?: string;
  reply_count?: number;
  user?: string;
}

// Messages used only to invite the bot (e.g. "@fb") arrive as bare mentions
// like "<@U12345>". Skip messages that contain nothing but mentions/punctuation.
function isOnlyMentions(text: string): boolean {
  return text.replace(/<@[^>]+>/g, '').replace(/[^\p{L}\p{N}]/gu, '') === '';
}

function getClient(): WebClient {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) throw new Error('SLACK_BOT_TOKEN non configurato in .env.local');
  return new WebClient(token);
}

async function fetchAllPrivateChannels(
  slack: WebClient
): Promise<Array<{ id: string; name: string }>> {
  const result: Array<{ id: string; name: string }> = [];
  let cursor: string | undefined;

  do {
    const res = await slack.conversations.list({
      types: 'private_channel',
      limit: 200,
      exclude_archived: true,
      cursor,
    });
    for (const ch of res.channels ?? []) {
      if (ch.id && ch.name) result.push({ id: ch.id, name: ch.name });
    }
    cursor = res.response_metadata?.next_cursor || undefined;
  } while (cursor);

  return result.filter(ch => CHANNEL_PATTERN.test(ch.name));
}

async function fetchChannelMessages(
  slack: WebClient,
  channelId: string
): Promise<SlackMessage[]> {
  const result: SlackMessage[] = [];
  let cursor: string | undefined;

  do {
    const res = await slack.conversations.history({
      channel: channelId,
      limit: 200,
      cursor,
    });
    for (const msg of res.messages ?? []) {
      if (
        msg.type === 'message' &&
        !msg.subtype &&
        msg.ts &&
        msg.text &&
        !isOnlyMentions(msg.text)
      ) {
        result.push(msg as SlackMessage);
      }
    }
    cursor = res.response_metadata?.next_cursor || undefined;
  } while (cursor);

  return result;
}

async function fetchThreadDetails(
  slack: WebClient,
  channelId: string,
  threadTs: string
): Promise<{ lastUpdateTs: number; firstReplyText: string }> {
  const res = await slack.conversations.replies({
    channel: channelId,
    ts: threadTs,
    limit: 200,
  });
  const messages = res.messages ?? [];
  if (messages.length === 0) {
    return { lastUpdateTs: parseFloat(threadTs), firstReplyText: '' };
  }
  const lastUpdateTs = Math.max(...messages.map(m => parseFloat(m.ts ?? '0')));
  // messages[0] is the thread parent; the description fallback is the first
  // actual reply that carries real text (skip bare bot-invite mentions).
  const firstReply = messages.find(
    m => m.ts !== threadTs && m.text && !isOnlyMentions(m.text)
  );
  return { lastUpdateTs, firstReplyText: firstReply?.text ?? '' };
}

// Resolves a Slack user ID to initials (first + last name), cached per request.
async function fetchAuthorInitials(
  slack: WebClient,
  userId: string | undefined,
  cache: Map<string, string>
): Promise<string> {
  if (!userId) return '';
  const cached = cache.get(userId);
  if (cached !== undefined) return cached;

  const res = await slack.users.info({ user: userId });
  const name =
    res.user?.profile?.real_name || res.user?.real_name || res.user?.name || '';
  const initials = toInitials(name);
  cache.set(userId, initials);
  return initials;
}

function toInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
  return (first + last).toUpperCase();
}

async function fetchPermalink(
  slack: WebClient,
  channelId: string,
  messageTs: string
): Promise<string> {
  const res = await slack.chat.getPermalink({
    channel: channelId,
    message_ts: messageTs,
  });
  return res.permalink ?? '';
}

export async function fetchCards(): Promise<CardItem[]> {
  const slack = getClient();
  const channels = await fetchAllPrivateChannels(slack);
  const items: CardItem[] = [];
  const userInitialsCache = new Map<string, string>();

  for (const channel of channels) {
    const parsedChannel = parseChannelName(channel.name);
    if (!parsedChannel) continue;

    const messages = await fetchChannelMessages(slack, channel.id);

    for (const message of messages) {
      const parsedMsg = parseMessage(emojify(message.text));
      if (!parsedMsg) continue;

      const replyCount = message.reply_count ?? 0;
      let lastThreadUpdateTs = parseFloat(message.ts);
      let description = parsedMsg.description;

      if (replyCount > 0) {
        const thread = await fetchThreadDetails(slack, channel.id, message.ts);
        lastThreadUpdateTs = thread.lastUpdateTs;
        // Description is the body below the title concatenated with the first
        // thread reply (skipping bare bot-invite mentions); either part may be
        // empty.
        if (thread.firstReplyText) {
          const firstReply = `{t} ${emojify(thread.firstReplyText).trim()}`;
          description = [description, firstReply].filter(Boolean).join('\n');
        }
      }

      const permalink = await fetchPermalink(slack, channel.id, message.ts);
      const authorInitials = await fetchAuthorInitials(
        slack,
        message.user,
        userInitialsCache
      );

      items.push({
        id: `${channel.id}-${message.ts}`,
        channelId: channel.id,
        channelName: channel.name,
        team: parsedChannel.team,
        personName: parsedChannel.personName,
        messageTs: message.ts,
        threadTs: message.thread_ts ?? message.ts,
        title: parsedMsg.title,
        description,
        permalink,
        lastThreadUpdateTs,
        lastThreadUpdateFormatted: formatRelativeDate(lastThreadUpdateTs),
        replyCount,
        authorInitials,
      });
    }
  }

  return items.sort((a, b) => b.lastThreadUpdateTs - a.lastThreadUpdateTs);
}

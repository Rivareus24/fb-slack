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
      if (msg.type === 'message' && !msg.subtype && msg.ts && msg.text) {
        result.push(msg as SlackMessage);
      }
    }
    cursor = res.response_metadata?.next_cursor || undefined;
  } while (cursor);

  return result;
}

async function fetchLatestThreadTs(
  slack: WebClient,
  channelId: string,
  threadTs: string
): Promise<number> {
  const res = await slack.conversations.replies({
    channel: channelId,
    ts: threadTs,
    limit: 200,
  });
  const messages = res.messages ?? [];
  if (messages.length === 0) return parseFloat(threadTs);
  return Math.max(...messages.map(m => parseFloat(m.ts ?? '0')));
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

  for (const channel of channels) {
    const parsedChannel = parseChannelName(channel.name);
    if (!parsedChannel) continue;

    const messages = await fetchChannelMessages(slack, channel.id);

    for (const message of messages) {
      const parsedMsg = parseMessage(emojify(message.text));
      if (!parsedMsg) continue;

      const replyCount = message.reply_count ?? 0;
      const lastThreadUpdateTs =
        replyCount > 0
          ? await fetchLatestThreadTs(slack, channel.id, message.ts)
          : parseFloat(message.ts);

      const permalink = await fetchPermalink(slack, channel.id, message.ts);

      items.push({
        id: `${channel.id}-${message.ts}`,
        channelId: channel.id,
        channelName: channel.name,
        team: parsedChannel.team,
        personName: parsedChannel.personName,
        messageTs: message.ts,
        threadTs: message.thread_ts ?? message.ts,
        title: parsedMsg.title,
        description: parsedMsg.description,
        permalink,
        lastThreadUpdateTs,
        lastThreadUpdateFormatted: formatRelativeDate(lastThreadUpdateTs),
        replyCount,
      });
    }
  }

  return items.sort((a, b) => b.lastThreadUpdateTs - a.lastThreadUpdateTs);
}

import { NextResponse } from 'next/server';
import { WebClient } from '@slack/web-api';
import { emojify } from 'node-emoji';
import { parseChannelName, parseMessage } from '@/lib/parse';

// Usage: /api/debug?channel=fb-uranium-team
export async function GET(request: Request) {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) return NextResponse.json({ error: 'SLACK_BOT_TOKEN missing' }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const targetName = searchParams.get('channel') ?? 'fb-uranium-team';

  const slack = new WebClient(token);

  const CHANNEL_PATTERN = /^fb-[^-]+(-[^-]+-[^-]+|-team)$/;

  const channelsRes = await slack.conversations.list({
    types: 'private_channel',
    limit: 200,
    exclude_archived: true,
  });

  const allFbChannels = (channelsRes.channels ?? [])
    .filter(c => c.id && c.name && CHANNEL_PATTERN.test(c.name!))
    .map(c => ({ id: c.id!, name: c.name! }));

  const targetChannel = allFbChannels.find(c => c.name === targetName);

  if (!targetChannel) {
    return NextResponse.json({
      error: `Channel "${targetName}" not found or bot has no access`,
      matchingChannels: allFbChannels.map(c => c.name),
    });
  }

  const historyRes = await slack.conversations.history({
    channel: targetChannel.id,
    limit: 50,
  });

  const messages = (historyRes.messages ?? [])
    .filter(m => m.type === 'message' && !m.subtype)
    .map(m => {
      const raw = m.text ?? '';
      const emojified = emojify(raw);
      return {
        ts: m.ts,
        raw,
        emojified,
        parsed: parseMessage(emojified),
        parsedChannel: parseChannelName(targetChannel.name),
      };
    });

  return NextResponse.json({ channel: targetChannel, messages });
}

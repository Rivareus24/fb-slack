import { NextResponse } from 'next/server';
import { WebClient } from '@slack/web-api';
import { parseChannelName, parseMessage } from '@/lib/parse';

export async function GET() {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) return NextResponse.json({ error: 'SLACK_BOT_TOKEN missing' }, { status: 500 });

  const slack = new WebClient(token);
  const CHANNEL_PATTERN = /^fb-[^-]+-[^-]+-[^-]+$/;

  const channelsRes = await slack.conversations.list({
    types: 'private_channel',
    limit: 200,
    exclude_archived: true,
  });

  const allChannels = (channelsRes.channels ?? [])
    .filter(c => c.id && c.name)
    .map(c => ({ id: c.id!, name: c.name!, matchesPattern: CHANNEL_PATTERN.test(c.name!) }));

  const targetChannel = allChannels.find(c => c.name === 'fb-plu-giovanni-pepe');

  if (!targetChannel) {
    return NextResponse.json({
      error: 'Channel fb-plu-giovanni-pepe not found in conversations.list',
      allChannels,
    });
  }

  const historyRes = await slack.conversations.history({
    channel: targetChannel.id,
    limit: 50,
  });

  const messages = (historyRes.messages ?? [])
    .filter(m => m.type === 'message' && !m.subtype)
    .map(m => ({
      ts: m.ts,
      text: m.text,
      parsed: m.text ? parseMessage(m.text) : null,
      parsedChannel: parseChannelName(targetChannel.name),
    }));

  return NextResponse.json({ channel: targetChannel, messages });
}

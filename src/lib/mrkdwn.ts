// Minimal Slack mrkdwn tokenizer for inline formatting.
// Supports *bold*, _italic_, `code`, ~strikethrough~ (single level, no nesting).

export type MrkdwnToken =
  | { type: 'text'; text: string }
  | { type: 'bold'; text: string }
  | { type: 'italic'; text: string }
  | { type: 'code'; text: string }
  | { type: 'strike'; text: string };

const DELIM_TYPE: Record<string, MrkdwnToken['type']> = {
  '`': 'code',
  '*': 'bold',
  '_': 'italic',
  '~': 'strike',
};

// Capturing group so String.split keeps the delimited spans.
const PATTERN = /(`[^`]+`|\*[^*]+\*|_[^_]+_|~[^~]+~)/;

export function tokenizeMrkdwn(input: string): MrkdwnToken[] {
  const tokens: MrkdwnToken[] = [];
  for (const part of input.split(PATTERN)) {
    if (!part) continue;
    const type = DELIM_TYPE[part[0]];
    if (type && part.length > 2 && part[part.length - 1] === part[0]) {
      tokens.push({ type, text: part.slice(1, -1) });
    } else {
      tokens.push({ type: 'text', text: part });
    }
  }
  return tokens;
}

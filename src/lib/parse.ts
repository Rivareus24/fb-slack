import type { ParsedChannel, ParsedMessage } from './types';

// Pattern: exactly fb-[team]-[nome]-[cognome] — team has no hyphens
const CHANNEL_PATTERN = /^fb-([^-]+)-([^-]+)-([^-]+)$/;

export function parseChannelName(channelName: string): ParsedChannel | null {
  const match = channelName.match(CHANNEL_PATTERN);
  if (!match) return null;
  const [, team, firstName, lastName] = match;
  return {
    team,
    personName: `${capitalize(firstName)} ${capitalize(lastName)}`,
  };
}

export function parseMessage(text: string): ParsedMessage | null {
  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length === 0) return null;

  const rawTitle = extractCapsTitle(lines[0]);
  if (!rawTitle) return null;

  return {
    title: toTitleCase(rawTitle),
    description: lines.slice(1).join('\n').trim(),
  };
}

// Extracts the leading ALL CAPS tokens from a line, stopping at the first token
// that contains a lowercase letter. Strips trailing non-alphanumeric characters.
// e.g. "TL WANNABE (non solo Ivan)" → "TL WANNABE"
function extractCapsTitle(line: string): string | null {
  const tokens = line.replace(/[*_]/g, '').split(/\s+/).filter(t => t.length > 0);
  const capsTokens: string[] = [];
  for (const token of tokens) {
    if (/[a-z]/.test(token)) break;
    capsTokens.push(token);
  }
  if (capsTokens.length === 0) return null;
  const title = capsTokens.join(' ').replace(/[^A-Z0-9]+$/, '').trim();
  return title || null;
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function toTitleCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

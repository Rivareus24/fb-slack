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

// A line is valid if it contains NO lowercase letters
const HAS_LOWERCASE = /[a-z]/;

export function parseMessage(text: string): ParsedMessage | null {
  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length === 0) return null;

  const firstLine = lines[0];
  if (HAS_LOWERCASE.test(firstLine)) return null;

  return {
    title: toTitleCase(firstLine),
    description: lines.slice(1).join('\n').trim(),
  };
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function toTitleCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

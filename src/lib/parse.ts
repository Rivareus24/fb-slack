import type { ParsedChannel, ParsedMessage } from './types';
import { resolveTeamName } from './teams';

const PERSON_CHANNEL_PATTERN = /^fb-([^-]+)-([^-]+)-([^-]+)$/;
const TEAM_CHANNEL_PATTERN = /^fb-([^-]+)-team$/;

export function parseChannelName(channelName: string): ParsedChannel | null {
  const personMatch = channelName.match(PERSON_CHANNEL_PATTERN);
  if (personMatch) {
    const [, rawTeam, firstName, lastName] = personMatch;
    return {
      team: resolveTeamName(rawTeam),
      personName: `${capitalize(firstName)} ${capitalize(lastName)}`,
    };
  }

  const teamMatch = channelName.match(TEAM_CHANNEL_PATTERN);
  if (teamMatch) {
    return { team: resolveTeamName(teamMatch[1]), personName: '' };
  }

  return null;
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
    title: rawTitle,
    description: lines.slice(1).join('\n').trim(),
  };
}

// Extracts the leading ALL CAPS tokens from a line, stopping at the first token
// that contains a lowercase letter. Strips trailing non-alphanumeric characters.
// Emoji shortcodes like :bust_in_silhouette: are skipped transparently.
// e.g. ":bust_in_silhouette: GIANMARCO SANTI ft Mario" → "GIANMARCO SANTI"
// e.g. "TL WANNABE (non solo Ivan)" → "TL WANNABE"
function extractCapsTitle(line: string): string | null {
  const tokens = line.replace(/[*_]/g, '').split(/\s+/).filter(t => t.length > 0);
  const capsTokens: string[] = [];
  for (const token of tokens) {
    if (/^:[a-z0-9_+-]+:$/.test(token)) continue; // unconverted emoji shortcode — skip
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


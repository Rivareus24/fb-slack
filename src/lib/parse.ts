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

  const rawTitle = extractTitle(lines[0]);
  if (!rawTitle) return null;

  return {
    title: rawTitle,
    description: lines.slice(1).join('\n').trim(),
  };
}

// Returns the whole line as the title, but only when it starts with an ALL CAPS
// token — this keeps the message a valid "card" (lowercase-led lines are rejected).
// Emoji shortcodes like :bust_in_silhouette: are dropped transparently.
// e.g. ":bust_in_silhouette: GIANMARCO SANTI ft Mario" → "GIANMARCO SANTI ft Mario"
// e.g. "COME si percepisce CAMILLA in Zupit" → "COME si percepisce CAMILLA in Zupit"
// e.g. "Titolo Normale" → null (first token has a lowercase letter)
function extractTitle(line: string): string | null {
  const tokens = line
    .replace(/[*_~`]/g, '') // strip Slack inline formatting markers
    .split(/\s+/)
    .filter(t => t.length > 0 && !/^:[a-z0-9_+-]+:$/.test(t)); // drop emoji shortcodes
  if (tokens.length === 0) return null;
  if (/[a-z]/.test(tokens[0])) return null; // first token must be ALL CAPS
  const title = tokens.join(' ').trim();
  return title || null;
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}


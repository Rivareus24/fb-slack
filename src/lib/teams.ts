// Maps channel prefixes (abbreviated or full) to canonical team names.
// Person channels use 3-letter prefix (plu, car, …); team channels use the full name.
const TEAM_MAP: Record<string, string> = {
  plu: 'Plutonium', plutonium: 'Plutonium',
  car: 'Carbon',    carbon:    'Carbon',
  arg: 'Argon',     argon:     'Argon',
  neo: 'Neon',      neon:      'Neon',
  ura: 'Uranium',   uranium:   'Uranium',
  tit: 'Titanium',  titanium:  'Titanium',
  hyd: 'Hydrogen',  hydrogen:  'Hydrogen',
  des: 'Design',    design:    'Design',
};

// Canonical display order for teams (filter chips, team sort).
export const TEAM_ORDER = [
  'Carbon', 'Uranium', 'Plutonium', 'Neon', 'Argon', 'Titanium', 'Hydrogen', 'Design',
];

export function teamRank(team: string): number {
  const i = TEAM_ORDER.indexOf(team);
  return i === -1 ? TEAM_ORDER.length : i;
}

export function resolveTeamName(raw: string): string {
  return TEAM_MAP[raw.toLowerCase()] ?? capitalize(raw);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

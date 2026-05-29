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
};

export function resolveTeamName(raw: string): string {
  return TEAM_MAP[raw.toLowerCase()] ?? capitalize(raw);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

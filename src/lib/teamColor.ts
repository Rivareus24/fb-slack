type TeamColors = { bg: string; text: string; border: string };

const COLORS: Record<string, TeamColors> = {
  Plutonium: { bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200'  },
  Carbon:    { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200'    },
  Argon:     { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  Neon:      { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-200'  },
  Uranium:   { bg: 'bg-yellow-50',  text: 'text-yellow-700',  border: 'border-yellow-200'  },
  Titanium:  { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200'     },
  Hydrogen:  { bg: 'bg-stone-100',  text: 'text-stone-600',   border: 'border-stone-300'   },
};

const FALLBACK: TeamColors = { bg: 'bg-zinc-50', text: 'text-zinc-600', border: 'border-zinc-200' };

export function teamColor(team: string): TeamColors {
  return COLORS[team] ?? FALLBACK;
}

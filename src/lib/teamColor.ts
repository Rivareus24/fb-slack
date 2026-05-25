const TEAM_PALETTE = [
  { bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-200'  },
  { bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200'  },
  { bg: 'bg-sky-50',     text: 'text-sky-600',     border: 'border-sky-200'     },
  { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200'   },
  { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200'    },
  { bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-200'    },
  { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-200'  },
];

export function teamColor(team: string) {
  const sum = [...team].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return TEAM_PALETTE[sum % TEAM_PALETTE.length];
}

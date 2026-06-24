type TeamColors = { bg: string; text: string; border: string; bar: string };

const COLORS: Record<string, TeamColors> = {
  Plutonium: { bg: 'bg-[#8E7CC3]/10', text: 'text-[#8E7CC3]', border: 'border-[#8E7CC3]/30', bar: 'bg-[#8E7CC3]' },
  Carbon:    { bg: 'bg-[#3D85C6]/10', text: 'text-[#3D85C6]', border: 'border-[#3D85C6]/30', bar: 'bg-[#3D85C6]' },
  Argon:     { bg: 'bg-[#2BB182]/10', text: 'text-[#2BB182]', border: 'border-[#2BB182]/30', bar: 'bg-[#2BB182]' },
  Neon:      { bg: 'bg-[#E69138]/10', text: 'text-[#E69138]', border: 'border-[#E69138]/30', bar: 'bg-[#E69138]' },
  Uranium:   { bg: 'bg-[#F1C232]/10', text: 'text-[#B8860B]', border: 'border-[#F1C232]/30', bar: 'bg-[#F1C232]' },
  Titanium:  { bg: 'bg-[#E06666]/10', text: 'text-[#E06666]', border: 'border-[#E06666]/30', bar: 'bg-[#E06666]' },
  Hydrogen:  { bg: 'bg-[#B67F46]/10', text: 'text-[#B67F46]', border: 'border-[#B67F46]/30', bar: 'bg-[#B67F46]' },
  Design:    { bg: 'bg-[#C27BA0]/10', text: 'text-[#C27BA0]', border: 'border-[#C27BA0]/30', bar: 'bg-[#C27BA0]' },
};

const FALLBACK: TeamColors = { bg: 'bg-zinc-100', text: 'text-zinc-600', border: 'border-zinc-200', bar: 'bg-zinc-400' };

export function teamColor(team: string): TeamColors {
  return COLORS[team] ?? FALLBACK;
}

type TeamColors = { bg: string; text: string; border: string; solidBorder: string; hoverBg: string; bar: string };

const COLORS: Record<string, TeamColors> = {
  Plutonium: { bg: 'bg-[#8E7CC3]/10', text: 'text-[#8E7CC3]', border: 'border-[#8E7CC3]/30', solidBorder: 'border-[#8E7CC3]', hoverBg: 'hover:bg-[#8E7CC3]/10', bar: 'bg-[#8E7CC3]' },
  Carbon:    { bg: 'bg-[#3D85C6]/10', text: 'text-[#3D85C6]', border: 'border-[#3D85C6]/30', solidBorder: 'border-[#3D85C6]', hoverBg: 'hover:bg-[#3D85C6]/10', bar: 'bg-[#3D85C6]' },
  Argon:     { bg: 'bg-[#2BB182]/10', text: 'text-[#2BB182]', border: 'border-[#2BB182]/30', solidBorder: 'border-[#2BB182]', hoverBg: 'hover:bg-[#2BB182]/10', bar: 'bg-[#2BB182]' },
  Neon:      { bg: 'bg-[#E69138]/10', text: 'text-[#E69138]', border: 'border-[#E69138]/30', solidBorder: 'border-[#E69138]', hoverBg: 'hover:bg-[#E69138]/10', bar: 'bg-[#E69138]' },
  Uranium:   { bg: 'bg-[#F1C232]/10', text: 'text-[#B8860B]', border: 'border-[#F1C232]/30', solidBorder: 'border-[#B8860B]', hoverBg: 'hover:bg-[#F1C232]/10', bar: 'bg-[#F1C232]' },
  Titanium:  { bg: 'bg-[#E06666]/10', text: 'text-[#E06666]', border: 'border-[#E06666]/30', solidBorder: 'border-[#E06666]', hoverBg: 'hover:bg-[#E06666]/10', bar: 'bg-[#E06666]' },
  Hydrogen:  { bg: 'bg-[#B67F46]/10', text: 'text-[#B67F46]', border: 'border-[#B67F46]/30', solidBorder: 'border-[#B67F46]', hoverBg: 'hover:bg-[#B67F46]/10', bar: 'bg-[#B67F46]' },
  Design:    { bg: 'bg-[#C27BA0]/10', text: 'text-[#C27BA0]', border: 'border-[#C27BA0]/30', solidBorder: 'border-[#C27BA0]', hoverBg: 'hover:bg-[#C27BA0]/10', bar: 'bg-[#C27BA0]' },
};

const FALLBACK: TeamColors = { bg: 'bg-zinc-100', text: 'text-zinc-600', border: 'border-zinc-200', solidBorder: 'border-zinc-400', hoverBg: 'hover:bg-zinc-100', bar: 'bg-zinc-400' };

export function teamColor(team: string): TeamColors {
  return COLORS[team] ?? FALLBACK;
}

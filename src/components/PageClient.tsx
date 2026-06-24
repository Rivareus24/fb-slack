'use client';

import { useState, useMemo } from 'react';
import type { CardItem } from '@/lib/types';
import { Card } from './Card';
import { InfoPopover } from './InfoPopover';
import { teamColor } from '@/lib/teamColor';

interface PageClientProps {
  items: CardItem[];
}

export function PageClient({ items }: PageClientProps) {
  // Derive teams from real data, alphabetically sorted
  const teams = useMemo(
    () => Array.from(new Set(items.map(i => i.team))).sort(),
    [items]
  );

  // Default: no team selected → all messages shown (faster to pick a single team)
  const [activeTeams, setActiveTeams] = useState<Set<string>>(() => new Set());
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'date' | 'team'>('date');

  const filtered = useMemo(() => {
    const noFilter = activeTeams.size === 0;

    const result = items.filter(item => {
      if (!noFilter && !activeTeams.has(item.team)) return false;
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.personName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });

    if (sortOrder === 'team') {
      result.sort((a, b) =>
        a.team.localeCompare(b.team, 'it') || a.personName.localeCompare(b.personName, 'it')
      );
    }
    // 'date': items from server are already sorted newest-first

    return result;
  }, [items, activeTeams, search, sortOrder]);

  function toggleTeam(team: string) {
    setActiveTeams(prev => {
      const next = new Set(prev);
      if (next.has(team)) next.delete(team);
      else next.add(team);
      return next;
    });
  }

  return (
    <div>
      {/* ── Top bar ── */}
      <header className="bg-white border-b border-zinc-200 px-9 h-[66px] flex items-center gap-5 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <svg
            width="26"
            height="26"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect width="32" height="32" rx="7" fill="#E01E5A" />
            <g transform="translate(7 7) scale(0.1466)" fill="#fff">
              <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zM32.3 77.6c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" />
              <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zM45.2 32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" />
              <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zM90.5 45.2c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" />
              <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zM77.6 90.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" />
            </g>
          </svg>
          <h1 className="text-[19px] font-bold text-zinc-900 tracking-tight">
            Zupit feedback people
          </h1>
          <InfoPopover />
        </div>

        {/* Search — horizontally centered in the top bar */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            width="18"
            height="18"
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca per titolo, team, zuppo o messaggio"
            aria-label="Cerca nella lista"
            className="w-full h-[38px] border border-zinc-200 rounded-lg pl-10 pr-3 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
          />
        </div>
      </header>

      {/* ── Filter bar ── */}
      <div
        className="bg-white border-b border-zinc-200 px-9 py-3.5 flex items-center gap-2 flex-wrap sticky top-[66px] z-10"
        role="group"
        aria-label="Filtra per team"
      >
        <span className="text-[13px] text-zinc-400 font-medium mr-1">Team:</span>

        {teams.map(team => (
          <button
            key={team}
            type="button"
            onClick={() => toggleTeam(team)}
            aria-pressed={activeTeams.has(team)}
            className={`text-[13px] font-medium px-[15px] py-[6px] rounded-full border-[1.5px] transition-all whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTeams.has(team)
                ? `${teamColor(team).bg} ${teamColor(team).text} ${teamColor(team).border}`
                : `bg-white ${teamColor(team).text} ${teamColor(team).border} opacity-70 hover:opacity-100`
            }`}
          >
            {team}
          </button>
        ))}

        <div className="w-px h-5 bg-zinc-200 mx-1.5" aria-hidden="true" />

        <div className="ml-auto flex items-center gap-2">
          <span className="text-[13px] text-zinc-400 font-medium whitespace-nowrap">Ordina per:</span>
          <div
            className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5"
            role="group"
            aria-label="Ordina per"
          >
            {([
              { value: 'date', label: 'Data aggiornamento' },
              { value: 'team', label: 'Team, Zuppo' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSortOrder(opt.value)}
                aria-pressed={sortOrder === opt.value}
                className={`text-[13px] font-medium px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  sortOrder === opt.value
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <main className="p-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16" role="status">
            <div className="text-3xl mb-3" aria-hidden="true">🔍</div>
            <p className="text-base font-medium text-zinc-500">Nessun risultato trovato</p>
            <p className="text-sm mt-1 text-zinc-400">
              Prova a modificare i filtri o la ricerca
            </p>
          </div>
        ) : (
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(370px, 1fr))' }}
          >
            {filtered.map(item => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

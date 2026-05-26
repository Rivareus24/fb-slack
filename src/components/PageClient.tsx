'use client';

import { useState, useMemo, useEffect } from 'react';
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

  // Default: all teams active
  const [activeTeams, setActiveTeams] = useState<Set<string>>(() => new Set(teams));
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'date' | 'team'>('date');

  useEffect(() => {
    setActiveTeams(new Set(teams));
  }, [teams]);

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
          <h1 className="text-[19px] font-bold text-zinc-900 tracking-tight">
            Zupit feedback people
          </h1>
          <InfoPopover />
        </div>

        {/* Search */}
        <div className="relative ml-auto max-w-xs w-full">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none"
            aria-hidden="true"
          >
            ⌕
          </span>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca per titolo, persona o descrizione…"
            aria-label="Cerca nella lista"
            className="w-full h-[38px] border border-zinc-200 rounded-lg pl-8 pr-3 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
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
                : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300 hover:text-zinc-600'
            }`}
          >
            {team}
          </button>
        ))}

        <div className="w-px h-5 bg-zinc-200 mx-1.5" aria-hidden="true" />

        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value as 'date' | 'team')}
          aria-label="Ordina per"
          className="ml-auto text-[13px] text-zinc-500 border border-zinc-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-400 cursor-pointer"
        >
          <option value="date">↓ Data aggiornamento</option>
          <option value="team">Team, Persona A-Z</option>
        </select>

        <span className="text-[13px] text-zinc-400 whitespace-nowrap" aria-live="polite" aria-atomic="true">
          {filtered.length} messaggi visibili
        </span>
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
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}
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

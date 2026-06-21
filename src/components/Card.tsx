import type { CardItem } from '@/lib/types';
import { isFreshThread } from '@/lib/date';
import { teamColor } from '@/lib/teamColor';

interface CardProps {
  item: CardItem;
}

function SlackIcon() {
  return (
    <svg viewBox="0 0 122.8 122.8" width="13" height="13" aria-hidden="true" className="shrink-0">
      <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zM32.3 77.6c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#E01E5A" />
      <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zM45.2 32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36C5F0" />
      <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zM90.5 45.2c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2EB67D" />
      <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zM77.6 90.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ECB22E" />
    </svg>
  );
}

export function Card({ item }: CardProps) {
  const fresh = isFreshThread(item.lastThreadUpdateTs);
  const color = teamColor(item.team);

  return (
    <a
      href={item.permalink || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white rounded-2xl p-7 border border-zinc-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.16)] hover:-translate-y-1.5 hover:scale-[1.015] hover:border-indigo-400 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-500 focus-visible:ring-offset-0 transition-all duration-200 cursor-pointer"
      aria-label={`${item.title} – ${item.personName} – ${item.team} – apri su Slack`}
    >
      {/* Titolo argomento */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <h2 className="text-[17px] font-bold text-zinc-900 leading-snug tracking-tight">
          {item.title}
        </h2>
        <span
          className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4A154B] bg-[#4A154B]/8 rounded-full px-2.5 py-1 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 transition-all duration-200 ease-out shrink-0 whitespace-nowrap"
          aria-hidden="true"
        >
          ↗ Slack
          <SlackIcon />
        </span>
      </div>

      {/* Riga persona */}
      <div className="flex items-center gap-2.5 py-3.5 border-y border-zinc-100 mb-5">
        <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${color.bg} ${color.text}`}>
          {item.team}
        </span>
        {item.personName && (
          <span className="text-[13.5px] font-semibold text-zinc-600">
            {item.personName}
          </span>
        )}
      </div>

      {/* Descrizione */}
      <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3 flex-1 mb-5">
        {item.description || (
          <span className="italic text-zinc-400">Nessuna descrizione</span>
        )}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-auto">
        <div className="flex items-center gap-1.5 text-[12.5px] text-zinc-400">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              fresh ? 'bg-green-400' : 'bg-zinc-300'
            }`}
            aria-hidden="true"
          />
          <time dateTime={new Date(item.lastThreadUpdateTs * 1000).toISOString()}>
            {item.lastThreadUpdateFormatted}
          </time>
          {item.authorInitials && (
            <span className="text-zinc-400">· by {item.authorInitials}</span>
          )}
        </div>
        {item.replyCount > 0 ? (
          <span className="text-xs font-medium text-blue-500 border border-blue-300 px-2.5 py-1 rounded-full">
            <span aria-hidden="true">🧵</span> {item.replyCount} {item.replyCount === 1 ? 'risposta' : 'risposte'}
          </span>
        ) : (
          <span className="text-xs font-medium text-zinc-400 border border-zinc-200 px-2.5 py-1 rounded-full">
            nessuna risposta
          </span>
        )}
      </div>
    </a>
  );
}

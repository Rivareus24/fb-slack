import type { CardItem } from '@/lib/types';
import { isFreshThread } from '@/lib/date';
import { teamColor } from '@/lib/teamColor';

interface CardProps {
  item: CardItem;
}

export function Card({ item }: CardProps) {
  const fresh = isFreshThread(item.lastThreadUpdateTs);
  const color = teamColor(item.team);

  return (
    <a
      href={item.permalink || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white rounded-2xl p-7 border border-zinc-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.09)] hover:-translate-y-[3px] focus:outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-500 focus-visible:ring-offset-0 transition-all duration-200 cursor-pointer hover:border-zinc-300"
      aria-label={`${item.title} – ${item.personName} – ${item.team} – apri su Slack`}
    >
      {/* Titolo argomento */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <h2 className="text-[17px] font-bold text-zinc-900 leading-snug tracking-tight">
          {item.title}
        </h2>
        <span
          className="text-xs text-zinc-400 opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-focus-visible:opacity-100 transition-opacity pt-0.5 shrink-0 whitespace-nowrap"
          aria-hidden="true"
        >
          ↗ Slack
        </span>
      </div>

      {/* Riga persona */}
      <div className="flex items-center gap-2.5 py-3.5 border-y border-zinc-100 mb-5">
        <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${color.bg} ${color.text}`}>
          {item.team}
        </span>
        <span className="text-[13.5px] font-semibold text-zinc-600">
          {item.personName}
        </span>
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
        </div>
        {item.replyCount > 0 ? (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
            <span aria-hidden="true">🧵</span> {item.replyCount} {item.replyCount === 1 ? 'risposta' : 'risposte'}
          </span>
        ) : (
          <span className="text-xs font-medium text-zinc-400 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-full">
            nessuna risposta
          </span>
        )}
      </div>
    </a>
  );
}

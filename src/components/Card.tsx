import { Fragment } from 'react';
import type { CardItem } from '@/lib/types';
import { isFreshThread } from '@/lib/date';
import { teamColor } from '@/lib/teamColor';
import { tokenizeMrkdwn } from '@/lib/mrkdwn';

interface CardProps {
  item: CardItem;
}

function renderDescription(text: string) {
  return tokenizeMrkdwn(text).map((token, i) => {
    switch (token.type) {
      case 'bold':
        return <strong key={i} className="font-semibold text-zinc-700">{token.text}</strong>;
      case 'italic':
        return <em key={i}>{token.text}</em>;
      case 'code':
        return (
          <code key={i} className="font-mono text-[12px] bg-zinc-100 text-zinc-700 rounded px-1 py-0.5">
            {token.text}
          </code>
        );
      case 'strike':
        return <s key={i}>{token.text}</s>;
      default:
        return <Fragment key={i}>{token.text}</Fragment>;
    }
  });
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
      className="group flex bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_6px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.16)] hover:-translate-y-1.5 hover:scale-[1.015] focus:outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-500 focus-visible:ring-offset-0 transition-all duration-200 cursor-pointer"
      aria-label={`${item.title} – ${item.personName} – ${item.team} – apri su Slack`}
    >
      {/* Banda colore team — sinistra */}
      <div className={`w-1.5 shrink-0 ${color.bar}`} aria-hidden="true" />

      <div className="flex flex-col flex-1 min-w-0 p-7">
        {/* Eyebrow: TEAM · Zuppo */}
        <div className="flex items-baseline gap-2 flex-wrap mb-3.5">
          <span className={`text-[11px] font-bold uppercase tracking-wider ${color.text}`}>
            {item.team}
          </span>
          {item.personName && (
            <span className="text-[12.5px] font-medium text-zinc-400">· {item.personName}</span>
          )}
        </div>

        {/* Titolo argomento */}
        <h2 className="text-[20px] font-extrabold text-zinc-900 leading-tight tracking-tight mb-3.5">
          {item.title}
        </h2>

        {/* Descrizione */}
        <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3 flex-1 mb-5 whitespace-pre-line">
          {item.description ? (
            renderDescription(item.description)
          ) : (
            <span className="italic text-zinc-400">Nessuna descrizione</span>
          )}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-1.5 text-[12px] text-zinc-400 pt-3.5 border-t border-zinc-100 mt-auto">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${fresh ? 'bg-green-400' : 'bg-zinc-300'}`}
            aria-hidden="true"
          />
          <time dateTime={new Date(item.lastThreadUpdateTs * 1000).toISOString()}>
            {item.lastThreadUpdateFormatted}
          </time>
          {item.authorInitials && <span>· by {item.authorInitials}</span>}
          <span className="ml-auto flex items-center gap-1 font-semibold text-[#4A154B] opacity-60 rounded-full px-2 py-0.5 group-hover:opacity-100 group-hover:bg-[#4A154B]/10 group-hover:scale-105 group-focus-visible:opacity-100 group-focus-visible:bg-[#4A154B]/10 transition-all duration-200">
            ↗ Slack
            <SlackIcon />
          </span>
        </div>
      </div>
    </a>
  );
}

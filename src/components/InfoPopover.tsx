'use client';

import { useState } from 'react';

export function InfoPopover() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        aria-label="Informazioni su come funziona la lista"
        aria-describedby="info-popover-content"
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="w-[22px] h-[22px] rounded-full border-[1.5px] border-zinc-400 text-zinc-500 text-[12px] font-semibold flex items-center justify-center transition-colors hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
      >
        i
      </button>

      {open && (
        <div
          id="info-popover-content"
          role="region"
          aria-label="Come funziona questa pagina"
          className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 max-w-[340px] w-[calc(100vw-32px)] bg-white border border-zinc-200 rounded-2xl shadow-xl p-5 z-50"
        >
          <div
            className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-l border-t border-zinc-200 rotate-45"
            aria-hidden="true"
          />

          <p className="text-[13px] font-bold text-zinc-900 mb-3">
            Come funziona questa pagina
          </p>

          <ul className="space-y-2">
            {[
              <>
                Legge messaggi dai canali Slack privati nel formato{' '}
                <code className="text-[11px] bg-zinc-100 px-1 py-0.5 rounded font-mono text-zinc-600">
                  fb-[team]-[nome]-[cognome]
                </code>
                ,{' '}
                <code className="text-[11px] bg-zinc-100 px-1 py-0.5 rounded font-mono text-zinc-600">
                  fb-[team]
                </code>
              </>,
              <>
                <strong className="font-semibold text-zinc-800">Nome</strong> e{' '}
                <strong className="font-semibold text-zinc-800">team</strong> sono estratti
                dal nome del canale
              </>,
              <>
                Il <strong className="font-semibold text-zinc-800">titolo</strong> è la
                prima riga del messaggio/argomento
              </>,
              'La descrizione è il testo che segue il titolo nel messaggio',
              <>
                Ordinate per{' '}
                <strong className="font-semibold text-zinc-800">
                  ultimo aggiornamento thread
                </strong>
                , dal più recente
              </>,
              'Clicca una card → apre il messaggio su Slack',
            ].map((text, i) => (
              <li key={i} className="flex gap-2 text-[12px] text-zinc-500 leading-relaxed">
                <span className="text-indigo-500 font-bold mt-px shrink-0" aria-hidden="true">
                  ·
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

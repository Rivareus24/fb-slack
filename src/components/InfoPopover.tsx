'use client';

export function InfoPopover() {
  return (
    <div className="relative inline-flex group">
      <button
        aria-label="Informazioni su come funziona la lista"
        className="w-[22px] h-[22px] rounded-full border-[1.5px] border-zinc-400 text-zinc-500 text-[12px] font-semibold flex items-center justify-center transition-colors hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
        tabIndex={0}
      >
        i
      </button>

      {/* Popover: visibile su hover o focus del gruppo */}
      <div
        role="tooltip"
        className="hidden group-hover:block group-focus-within:block absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[340px] bg-white border border-zinc-200 rounded-2xl shadow-xl p-5 z-50"
      >
        {/* Freccia */}
        <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-l border-t border-zinc-200 rotate-45" />

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
            </>,
            <>
              <strong className="font-semibold text-zinc-800">Nome</strong> e{' '}
              <strong className="font-semibold text-zinc-800">team</strong> sono estratti
              dal nome del canale
            </>,
            <>
              Il <strong className="font-semibold text-zinc-800">titolo</strong> è la
              prima riga del messaggio in maiuscolo (l&apos;argomento trattato)
            </>,
            'La descrizione è il testo che segue il titolo nel messaggio',
            <>
              Ordinate per{' '}
              <strong className="font-semibold text-zinc-800">
                ultimo aggiornamento thread
              </strong>
              , dal più recente
            </>,
            'Clicca una card → apre il messaggio originale su Slack',
            'I toggle filtrano per team; se nessuno è attivo, vedi tutto',
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
    </div>
  );
}

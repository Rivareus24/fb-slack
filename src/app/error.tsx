'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <div className="text-3xl" aria-hidden="true">⚠️</div>
      <h2 className="text-lg font-semibold text-zinc-800">
        Impossibile caricare i dati da Slack
      </h2>
      <p className="text-sm text-zinc-500 max-w-sm">
        {error.message || 'Errore durante il fetch dei canali Slack.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 px-5 py-2 bg-zinc-900 text-white text-sm font-medium rounded-full hover:bg-zinc-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        Riprova
      </button>
    </div>
  );
}

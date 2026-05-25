import { loginAction } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-[19px] font-bold text-zinc-900 tracking-tight mb-1">
          Zupit feedback people
        </h1>
        <p className="text-sm text-zinc-400 mb-6">Inserisci il token per accedere</p>

        {error && (
          <div className="mb-4 px-3.5 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-600">
            Token non valido
          </div>
        )}

        <form action={loginAction} className="flex flex-col gap-3">
          <input
            type="password"
            name="token"
            placeholder="Token di accesso"
            autoComplete="current-password"
            required
            className="w-full h-[42px] border border-zinc-200 rounded-lg px-3.5 text-sm text-zinc-900 bg-zinc-50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
          />
          <button
            type="submit"
            className="w-full h-[42px] bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
}

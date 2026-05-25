// src/components/CardSkeleton.tsx
export function CardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl p-7 border border-zinc-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] animate-pulse">
      {/* Titolo */}
      <div className="flex justify-between items-start gap-3 mb-5">
        <div className="h-5 bg-zinc-100 rounded w-3/4" />
        <div className="h-3 bg-zinc-100 rounded w-10 mt-1" />
      </div>
      {/* Persona */}
      <div className="flex items-center gap-2.5 py-3.5 border-y border-zinc-100 mb-5">
        <div className="w-[30px] h-[30px] rounded-full bg-zinc-100 shrink-0" />
        <div className="h-3.5 bg-zinc-100 rounded flex-1" />
        <div className="h-6 bg-zinc-100 rounded-full w-20" />
      </div>
      {/* Descrizione */}
      <div className="space-y-2 flex-1 mb-5">
        <div className="h-3 bg-zinc-100 rounded w-full" />
        <div className="h-3 bg-zinc-100 rounded w-5/6" />
        <div className="h-3 bg-zinc-100 rounded w-4/6" />
      </div>
      {/* Footer */}
      <div className="flex justify-between pt-4 border-t border-zinc-100 mt-auto">
        <div className="h-3 bg-zinc-100 rounded w-20" />
        <div className="h-6 bg-zinc-100 rounded-full w-24" />
      </div>
    </div>
  );
}

import { CardSkeleton } from '@/components/CardSkeleton';

export default function Loading() {
  return (
    <div>
      {/* Placeholder top bar */}
      <div className="bg-white border-b border-zinc-200 h-[66px] sticky top-0 z-20" />
      {/* Placeholder filter bar */}
      <div className="bg-white border-b border-zinc-200 h-[53px] sticky top-[66px] z-10" />
      {/* Skeleton grid */}
      <div className="p-8">
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

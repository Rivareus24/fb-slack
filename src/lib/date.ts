export function formatRelativeDate(ts: number): string {
  const diffMs = Date.now() - ts * 1000;
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) return 'adesso';
  if (minutes < 60) return `${minutes} min fa`;
  if (hours < 24) return `${hours}h fa`;
  if (days === 1) return 'ieri';
  if (days < 7) return `${days} giorni fa`;
  if (days < 30) return `${Math.floor(days / 7)} settimane fa`;

  return new Date(ts * 1000).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function isFreshThread(ts: number): boolean {
  return Date.now() - ts * 1000 < 48 * 3_600_000;
}

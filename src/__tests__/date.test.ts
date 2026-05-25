import { formatRelativeDate, isFreshThread } from '@/lib/date';

const now = Math.floor(Date.now() / 1000);

describe('formatRelativeDate', () => {
  it('restituisce "adesso" per meno di 1 minuto fa', () => {
    expect(formatRelativeDate(now - 30)).toBe('adesso');
  });

  it('restituisce minuti fa', () => {
    expect(formatRelativeDate(now - 5 * 60)).toBe('5 min fa');
    expect(formatRelativeDate(now - 59 * 60)).toBe('59 min fa');
  });

  it('restituisce ore fa', () => {
    expect(formatRelativeDate(now - 3 * 3600)).toBe('3h fa');
    expect(formatRelativeDate(now - 23 * 3600)).toBe('23h fa');
  });

  it('restituisce "ieri" per esattamente 1 giorno fa', () => {
    expect(formatRelativeDate(now - 86400)).toBe('ieri');
  });

  it('restituisce giorni per 2-6 giorni fa', () => {
    expect(formatRelativeDate(now - 3 * 86400)).toBe('3 giorni fa');
    expect(formatRelativeDate(now - 6 * 86400)).toBe('6 giorni fa');
  });

  it('restituisce settimane per 7+ giorni fa', () => {
    expect(formatRelativeDate(now - 7 * 86400)).toBe('1 settimane fa');
    expect(formatRelativeDate(now - 14 * 86400)).toBe('2 settimane fa');
  });
});

describe('isFreshThread', () => {
  it('restituisce true per thread aggiornati meno di 48h fa', () => {
    expect(isFreshThread(now - 3600)).toBe(true);
    expect(isFreshThread(now - 47 * 3600)).toBe(true);
  });

  it('restituisce false per thread aggiornati più di 48h fa', () => {
    expect(isFreshThread(now - 49 * 3600)).toBe(false);
    expect(isFreshThread(now - 7 * 86400)).toBe(false);
  });
});

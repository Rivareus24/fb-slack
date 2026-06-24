import { tokenizeMrkdwn } from '@/lib/mrkdwn';

describe('tokenizeMrkdwn', () => {
  it('restituisce un singolo token di testo quando non c\'è formattazione', () => {
    expect(tokenizeMrkdwn('testo semplice')).toEqual([
      { type: 'text', text: 'testo semplice' },
    ]);
  });

  it('riconosce grassetto, corsivo e monospace', () => {
    expect(tokenizeMrkdwn('Spoiler: *Cami* si percepisce nella sfera del `OK`')).toEqual([
      { type: 'text', text: 'Spoiler: ' },
      { type: 'bold', text: 'Cami' },
      { type: 'text', text: ' si percepisce nella sfera del ' },
      { type: 'code', text: 'OK' },
    ]);
  });

  it('riconosce corsivo e barrato', () => {
    expect(tokenizeMrkdwn('_ciao_ ~vecchio~')).toEqual([
      { type: 'italic', text: 'ciao' },
      { type: 'text', text: ' ' },
      { type: 'strike', text: 'vecchio' },
    ]);
  });

  it('lascia come testo i marcatori spaiati', () => {
    expect(tokenizeMrkdwn('un * solo asterisco')).toEqual([
      { type: 'text', text: 'un * solo asterisco' },
    ]);
  });
});

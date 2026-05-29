import { parseChannelName, parseMessage } from '@/lib/parse';

describe('parseChannelName', () => {
  it('estrae team, nome e cognome da un canale valido', () => {
    expect(parseChannelName('fb-engineering-marco-rossi')).toEqual({
      team: 'engineering',
      personName: 'Marco Rossi',
    });
  });

  it('capitalizza nome e cognome', () => {
    expect(parseChannelName('fb-design-sara-bianchi')).toEqual({
      team: 'design',
      personName: 'Sara Bianchi',
    });
  });

  it('restituisce null per canali che non rispettano il pattern', () => {
    expect(parseChannelName('general')).toBeNull();
    expect(parseChannelName('fb-engineering')).toBeNull();
    expect(parseChannelName('engineering-marco-rossi')).toBeNull();
  });

  it('restituisce null se il canale ha troppi segmenti (team con trattino)', () => {
    expect(parseChannelName('fb-design-ops-john-doe')).toBeNull();
  });

  it('riconosce i canali team nel formato fb-[nometeam]-team', () => {
    expect(parseChannelName('fb-engineering-team')).toEqual({ team: 'engineering', personName: '' });
    expect(parseChannelName('fb-uranium-team')).toEqual({ team: 'uranium', personName: '' });
    expect(parseChannelName('fb-carbon-team')).toEqual({ team: 'carbon', personName: '' });
  });

  it('funziona con vari team', () => {
    expect(parseChannelName('fb-product-luca-ferrari')?.team).toBe('product');
    expect(parseChannelName('fb-ops-giulia-verdi')?.personName).toBe('Giulia Verdi');
  });
});

describe('parseMessage', () => {
  it('estrae titolo e descrizione da un messaggio valido', () => {
    const text = 'ARCHITETTURA MICROSERVIZI\nDescrizione del contenuto qui';
    expect(parseMessage(text)).toEqual({
      title: 'ARCHITETTURA MICROSERVIZI',
      description: 'Descrizione del contenuto qui',
    });
  });

  it('restituisce null per messaggi che iniziano con lettere minuscole', () => {
    expect(parseMessage('hello world\ndescrizione')).toBeNull();
  });

  it('gestisce messaggi senza descrizione', () => {
    expect(parseMessage('SOLO TITOLO')).toEqual({
      title: 'SOLO TITOLO',
      description: '',
    });
  });

  it('ignora newline multipli e spazi extra', () => {
    const text = '  TITOLO DEL PROGETTO  \n\n  Descrizione qui\n  seconda riga  ';
    const result = parseMessage(text);
    expect(result?.title).toBe('TITOLO DEL PROGETTO');
    expect(result?.description).toBe('Descrizione qui\nseconda riga');
  });

  it('restituisce null per testo vuoto o solo spazi', () => {
    expect(parseMessage('')).toBeNull();
    expect(parseMessage('   \n\n  ')).toBeNull();
  });

  it('accetta ALL CAPS con numeri e punteggiatura', () => {
    expect(parseMessage('PROGETTO 2024: UPGRADE\nDescrizione')).not.toBeNull();
  });

  it('restituisce null se la prima riga inizia con lettere minuscole', () => {
    expect(parseMessage('hello world\ndescrizione')).toBeNull();
    expect(parseMessage('Titolo Normale\ndescrizione')).toBeNull();
  });

  it('salta shortcode emoji non convertiti e estrae il titolo caps', () => {
    expect(parseMessage(':bust_in_silhouette: GIANMARCO SANTI ft Mario e Camilla')).toEqual({
      title: 'GIANMARCO SANTI',
      description: '',
    });
    expect(parseMessage(':fire: PROGETTO ALPHA\nDescrizione')).toEqual({
      title: 'PROGETTO ALPHA',
      description: 'Descrizione',
    });
  });

  it('estrae solo la parte in maiuscolo se la prima riga ha un suffisso minuscolo', () => {
    expect(parseMessage('TL WANNABE    (non solo Ivan :eyes: )')).toEqual({
      title: 'TL WANNABE',
      description: '',
    });
    expect(parseMessage('TITOLO parziale\ndescrizione')).toEqual({
      title: 'TITOLO',
      description: 'descrizione',
    });
  });
});

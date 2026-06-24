import { parseChannelName, parseMessage } from '@/lib/parse';

describe('parseChannelName', () => {
  it('risolve il prefisso abbreviato al nome completo del team', () => {
    expect(parseChannelName('fb-plu-marco-rossi')).toEqual({
      team: 'Plutonium',
      personName: 'Marco Rossi',
    });
    expect(parseChannelName('fb-car-sara-bianchi')).toEqual({
      team: 'Carbon',
      personName: 'Sara Bianchi',
    });
  });

  it('risolve tutti i team noti', () => {
    expect(parseChannelName('fb-arg-a-b')?.team).toBe('Argon');
    expect(parseChannelName('fb-neo-a-b')?.team).toBe('Neon');
    expect(parseChannelName('fb-ura-a-b')?.team).toBe('Uranium');
    expect(parseChannelName('fb-tit-a-b')?.team).toBe('Titanium');
    expect(parseChannelName('fb-hyd-a-b')?.team).toBe('Hydrogen');
  });

  it('restituisce null per canali che non rispettano il pattern', () => {
    expect(parseChannelName('general')).toBeNull();
    expect(parseChannelName('fb-plu')).toBeNull();
    expect(parseChannelName('plu-marco-rossi')).toBeNull();
  });

  it('restituisce null se il canale ha troppi segmenti (team con trattino)', () => {
    expect(parseChannelName('fb-design-ops-john-doe')).toBeNull();
  });

  it('riconosce i canali team nel formato fb-[nometeam]-team', () => {
    expect(parseChannelName('fb-uranium-team')).toEqual({ team: 'Uranium', personName: '' });
    expect(parseChannelName('fb-carbon-team')).toEqual({ team: 'Carbon', personName: '' });
    expect(parseChannelName('fb-plutonium-team')).toEqual({ team: 'Plutonium', personName: '' });
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

  it('salta shortcode emoji non convertiti e tiene tutta la prima riga', () => {
    expect(parseMessage(':bust_in_silhouette: GIANMARCO SANTI ft Mario e Camilla')).toEqual({
      title: 'GIANMARCO SANTI ft Mario e Camilla',
      description: '',
    });
    expect(parseMessage(':fire: PROGETTO ALPHA\nDescrizione')).toEqual({
      title: 'PROGETTO ALPHA',
      description: 'Descrizione',
    });
  });

  it('tiene tutta la prima riga quando inizia in maiuscolo', () => {
    expect(parseMessage('TL WANNABE    (non solo Ivan :eyes: )')).toEqual({
      title: 'TL WANNABE (non solo Ivan )',
      description: '',
    });
    expect(parseMessage('TITOLO parziale\ndescrizione')).toEqual({
      title: 'TITOLO parziale',
      description: 'descrizione',
    });
  });

  it('tiene la prima riga completa anche con minuscole dopo il primo token caps', () => {
    expect(
      parseMessage(
        'COME si percepisce CAMILLA in Zupit\nSpoiler: Cami si percepisce nella sfera del OK',
      ),
    ).toEqual({
      title: 'COME si percepisce CAMILLA in Zupit',
      description: 'Spoiler: Cami si percepisce nella sfera del OK',
    });
  });
});

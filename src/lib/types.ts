export interface CardItem {
  id: string;                        // `${channelId}-${messageTs}`
  channelId: string;
  channelName: string;               // es. "fb-engineering-marco-rossi"
  team: string;                      // es. "engineering"
  personName: string;                // es. "Marco Rossi"
  messageTs: string;                 // timestamp Slack del messaggio padre
  threadTs: string;                  // ts del thread (= messageTs se no replies)
  title: string;                     // prima riga del messaggio normalizzata
  description: string;               // resto del messaggio
  permalink: string;                 // URL Slack per aprire il messaggio
  lastThreadUpdateTs: number;        // unix timestamp (float) per ordinamento
  lastThreadUpdateFormatted: string; // es. "2h fa", "ieri"
  replyCount: number;
}

export interface ParsedChannel {
  team: string;
  personName: string;
}

export interface ParsedMessage {
  title: string;
  description: string;
}

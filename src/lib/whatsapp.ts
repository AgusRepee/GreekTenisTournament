/** WhatsApp number in international format (no + or spaces). */
export const WHATSAPP_PHONE = '5491166459100';

/**
 * Builds a WhatsApp wa.me link that opens in a new tab with a pre-filled message.
 */
export function whatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export const whatsAppMessages = {
  tournamentRegistration: (tournamentName: string) =>
    `Hola, quiero anotarme al torneo ${tournamentName}`,
  tournamentInfo: (tournamentName: string) =>
    `Hola, quiero consultar información sobre el torneo ${tournamentName}`,
  tennisClasses: () =>
    'Hola, quiero consultar sobre clases de tenis',
};

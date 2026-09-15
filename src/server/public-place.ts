import "server-only";

export function redactPublicPlaceText(value: string): string {
  return value
    .replace(/\bréduction(?:\s+de)?\s+(?:−|-)?\s?\d{1,2}\s?%(?:\s+pour\s+les\s+membres(?:\s+Label Vanlife)?)?/gi, "avantage accessible dans l’espace membre")
    .replace(/(?:−|-)?\s?\d{1,2}\s?%/g, "un avantage réservé aux membres")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "une coordonnée réservée aux membres")
    .replace(/(?:\+33|0)[\s.-]?(?:\d[\s.-]?){9}/g, "une coordonnée téléphonique réservée aux membres")
    .replace(/https?:\/\/[^\s)]+/gi, "un site réservé aux membres");
}

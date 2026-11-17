import { CURRENCY, LOCALE } from "@/config/store";

/**
 * Precio en céntimos → texto para la persona: `1490` → `14,90 €`.
 *
 * Los precios se guardan siempre en céntimos (números enteros) para no
 * arrastrar errores de los decimales. El idioma y la moneda los pone la
 * tienda en `config/store.ts`.
 */
export function formatPrice(cents: number, locale = LOCALE, currency = CURRENCY): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
}

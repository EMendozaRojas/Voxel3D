/** Estado del stock de un producto o variante, con el texto que se muestra. */
export type StockStatus =
  { kind: "out"; label: string } | { kind: "low"; label: string } | { kind: "in"; label: string };

/**
 * ¿Hay stock? Regla de la tienda (una sola, aquí):
 * - 0 (o menos) → "Agotado";
 * - igual o menos que el umbral → "Quedan N";
 * - más → "En stock".
 *
 * El umbral es un dato: se decidirá en el change `inventory`.
 */
export function getStockStatus(stock: number, lowStockThreshold: number): StockStatus {
  if (stock <= 0) return { kind: "out", label: "Agotado" };
  if (stock <= lowStockThreshold) return { kind: "low", label: `Quedan ${stock}` };
  return { kind: "in", label: "En stock" };
}

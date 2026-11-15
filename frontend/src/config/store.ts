/**
 * Nombre de la tienda. Llega de `STORE_NAME` (el mismo que usa el backend) a
 * través de `NEXT_PUBLIC_STORE_NAME`; el motor nunca escribe el nombre a mano.
 *
 * Next.js lo escribe dentro del código al construir la web, así que si falta
 * se avisa en ese momento (como hace el backend al arrancar), en vez de
 * publicar una tienda sin nombre.
 */
function readStoreName(value: string | undefined): string {
  const name = value?.trim();
  if (!name) {
    throw new Error(
      "Falta NEXT_PUBLIC_STORE_NAME: el nombre de la tienda (se toma de STORE_NAME en .env).",
    );
  }
  return name;
}

// process.env.NEXT_PUBLIC_STORE_NAME se escribe tal cual para que Next.js
// pueda sustituirlo al construir.
export const STORE_NAME: string = readStoreName(process.env.NEXT_PUBLIC_STORE_NAME);

export { readStoreName };

/**
 * Aviso que se ve en todas las páginas mientras los pagos son de prueba
 * (Stripe en modo de pruebas). Dónde vive la configuración de la tienda se
 * decide en `guest-checkout`.
 */
export const DEMO_NOTICE = "Modo demostración: no se cobra dinero real.";

/** Idioma y moneda de la tienda (formato de precios y fechas). */
export const LOCALE = "es-ES";
export const CURRENCY = "EUR";

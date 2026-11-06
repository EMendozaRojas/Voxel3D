/**
 * Dirección base de la API. Next.js la escribe dentro del código al construir
 * la web (`next build`), así que cambiarla después exige volver a construir.
 */
export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

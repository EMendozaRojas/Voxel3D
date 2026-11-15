/**
 * Contrato entre el motor (chasis) y la carrocería (`src/theme/`).
 *
 * Aquí se dice QUÉ datos recibe cada pieza de la carrocería, nunca cómo se
 * ve. Cada tienda dibuja sus piezas como quiera, pero tiene que aceptar
 * estos datos; si olvida uno o lo llama distinto, `tsc` falla antes de
 * construir.
 *
 * Se irá completando pieza a pieza (cabecera, pie, tarjeta de producto…).
 */
import type { ReactNode } from "react";

/** Disposición común de todas las páginas: la carrocería decide dónde va cada cosa. */
export type StoreLayoutProps = {
  /** El contenido de la página actual. */
  children: ReactNode;
};

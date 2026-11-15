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

import type { NavLink } from "./navigation";

/** Disposición común de todas las páginas: la carrocería decide dónde va cada cosa. */
export type StoreLayoutProps = {
  /** El contenido de la página actual. */
  children: ReactNode;
};

/** Cabecera de la tienda. */
export type SiteHeaderProps = {
  /** Enlaces del menú (de `config/navigation.ts`). */
  links: NavLink[];
  /** Dirección de la página actual, para marcar su enlace (`isActivePath`). */
  currentPath: string;
  /** Unidades en el carrito; 0 si está vacío. */
  cartCount: number;
};

/** Pie de la tienda. */
export type SiteFooterProps = {
  storeName: string;
  /** Aviso de modo demostración: tiene que verse en todas las páginas. */
  demoNotice: string;
};

/** Barra inferior del móvil. */
export type BottomNavProps = {
  /** Enlaces fijos de la barra. */
  links: NavLink[];
  /** Enlaces del panel que abre el botón «Más». */
  moreLinks: NavLink[];
  /** Dirección de la página actual, para marcar su enlace (`isActivePath`). */
  currentPath: string;
};

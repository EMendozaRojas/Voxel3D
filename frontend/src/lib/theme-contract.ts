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
import type { StockStatus } from "./stock";

/**
 * Disposición común de todas las páginas: la carrocería decide dónde va cada
 * cosa. Los enlaces, el nombre y el aviso de demostración los lee de
 * `config/`.
 */
export type StoreLayoutProps = {
  /** El contenido de la página actual. */
  children: ReactNode;
  /** Dirección de la página actual (la da el motor con `usePathname`). */
  currentPath: string;
  /** Unidades en el carrito; 0 si está vacío. */
  cartCount: number;
};

/** Portada. */
export type HomeViewProps = {
  /** Estado de la conexión con el servidor (lo prepara el motor). */
  serverStatus: ReactNode;
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

/** Etiqueta de stock: el motor decide el estado y el texto (`getStockStatus`). */
export type StockBadgeProps = {
  status: StockStatus;
};

/** Producto tal como lo muestra una tarjeta del listado. */
export type ProductSummary = {
  id: string;
  name: string;
  /** Precio en céntimos (`formatPrice` lo convierte en "14,90 €"). */
  priceCents: number;
  /** Texto corto bajo el precio (por ejemplo, material y acabado). */
  shortDescription: string;
  stock: number;
  /** Foto del producto; si falta, la carrocería pone un marcador. */
  image?: { src: string; alt: string };
};

/** Tarjeta de producto. */
export type ProductCardProps = {
  product: ProductSummary;
  /** A partir de cuántas unidades se avisa de "Quedan N". */
  lowStockThreshold: number;
  /** Acción del botón "Añadir al carrito" (llega con el change `cart`). */
  onAddToCart?: () => void;
};

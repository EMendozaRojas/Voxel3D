import type { NavLink } from "@/lib/navigation";

/**
 * Enlaces de la tienda. Cada tienda cambia los textos y el orden; las
 * direcciones apuntan a páginas del motor (algunas llegarán en próximos
 * changes).
 */

/** Menú de la cabecera (escritorio). */
export const headerLinks: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
];

/** Barra inferior (móvil). Al final va siempre el botón «Más». */
export const bottomNavLinks: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Cuenta", href: "/cuenta" },
];

/** Enlaces del panel que abre «Más» en la barra inferior. */
export const moreLinks: NavLink[] = [{ label: "Sobre nosotros", href: "/sobre-nosotros" }];

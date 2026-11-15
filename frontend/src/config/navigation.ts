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

/** Barra inferior (móvil). */
export const bottomNavLinks: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Cuenta", href: "/cuenta" },
  { label: "Más", href: "/mas" },
];

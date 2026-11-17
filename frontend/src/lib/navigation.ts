/** Un enlace del menú: el texto lo pone cada tienda en `config/navigation.ts`. */
export type NavLink = {
  label: string;
  href: string;
};

/**
 * ¿Está la persona en la página de este enlace (o dentro de ella)?
 *
 * - La portada (`/`) solo está activa en la propia portada; si no, estaría
 *   activa en todas las páginas.
 * - Cualquier otro enlace está activo en su página y en las que cuelgan de
 *   ella: `/productos` está activo en `/productos/macetas`, pero no en
 *   `/productos-nuevos`.
 */
export function isActivePath(currentPath: string, href: string): boolean {
  if (href === "/") return currentPath === "/";
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

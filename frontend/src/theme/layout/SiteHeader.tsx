import Link from "next/link";

import { isActivePath } from "@/lib/navigation";
import type { SiteHeaderProps } from "@/lib/theme-contract";

import { Logo } from "./Logo";

/** "Carrito", "Carrito, 1 producto", "Carrito, 3 productos". */
function cartLabel(count: number): string {
  if (count === 0) return "Carrito";
  return `Carrito, ${count} ${count === 1 ? "producto" : "productos"}`;
}

const roundButton =
  "relative grid size-11 shrink-0 place-items-center rounded-full bg-icon-button bg-(image:--gradient-icon-button) text-on-icon-button";

/**
 * Cabecera de Voxel3D: acero perforado con línea de acento, logo a la
 * izquierda y, a la derecha, un panel liso con el menú, la cuenta y el
 * carrito. En el móvil solo se ven el logo y el carrito (el menú va en la
 * barra inferior).
 */
export function SiteHeader({ links, currentPath, cartCount }: SiteHeaderProps) {
  return (
    <header className="decor-perforated decor-line-bottom">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:py-3.5">
        <Logo />

        <div className="flex items-center gap-4 sm:rounded-pill sm:border-2 sm:border-accent-strong sm:bg-field sm:py-1.5 sm:pr-2 sm:pl-5">
          <nav aria-label="Menú principal" className="hidden sm:block">
            <ul className="flex gap-5">
              {links.map((link) => {
                const active = isActivePath(currentPath, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`block border-b-2 py-1 font-label font-semibold tracking-[1px] uppercase ${
                        active
                          ? "border-accent text-accent-text"
                          : "border-transparent text-on-header hover:text-accent-text"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link href="/cuenta" aria-label="Mi cuenta" className={`${roundButton} hidden sm:grid`}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              className="size-[22px]"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
            </svg>
          </Link>

          <Link href="/carrito" aria-label={cartLabel(cartCount)} className={roundButton}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              className="size-[22px]"
            >
              <path d="M3 4h2l2.4 11h11l2-8H6.2" />
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
            </svg>
            {cartCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-pill bg-badge px-1.5 text-xs font-bold text-on-badge"
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

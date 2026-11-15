"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { useDisclosure } from "@/hooks/useDisclosure";
import { isActivePath } from "@/lib/navigation";
import type { BottomNavProps } from "@/lib/theme-contract";

const ICONS: Record<string, ReactNode> = {
  "/": <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  "/productos": (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </>
  ),
  "/cuenta": (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
};

const MORE_ICON = (
  <>
    <circle cx="5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="19" cy="12" r="1.6" />
  </>
);

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="size-6"
    >
      {children}
    </svg>
  );
}

const item =
  "flex min-h-11 flex-col items-center justify-center gap-0.5 font-label text-xs font-semibold tracking-[1px] uppercase";
const itemColor = (active: boolean) =>
  active ? "text-accent-text" : "text-on-header hover:text-accent-text";

/**
 * Barra inferior de Voxel3D (solo en el móvil): acero perforado con línea de
 * acento arriba. «Más» abre un panel desde abajo con el resto de enlaces.
 */
export function BottomNav({ links, moreLinks, currentPath }: BottomNavProps) {
  const { isOpen, toggle, close, containerRef } = useDisclosure<HTMLDivElement>();
  const moreActive = moreLinks.some((link) => isActivePath(currentPath, link.href));

  return (
    <nav
      aria-label="Menú del móvil"
      className="decor-perforated decor-line-top fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom,0px)] sm:hidden"
    >
      <div ref={containerRef}>
        <div
          id="panel-mas"
          hidden={!isOpen}
          className="absolute inset-x-0 bottom-full rounded-t-card border-t-2 border-accent-strong bg-header px-4 pt-4 pb-5 shadow-[0_-12px_30px_rgb(0_0_0/0.5)]"
        >
          <ul className="grid gap-1">
            {moreLinks.map((link) => {
              const active = isActivePath(currentPath, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={close}
                    className={`flex min-h-11 items-center px-2 font-label font-semibold tracking-[1px] uppercase ${itemColor(active)}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <ul className="grid h-16 grid-cols-4">
          {links.map((link) => {
            const active = isActivePath(currentPath, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`${item} h-full ${itemColor(active)}`}
                >
                  <Icon>{ICONS[link.href] ?? MORE_ICON}</Icon>
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls="panel-mas"
              onClick={toggle}
              className={`${item} h-full w-full ${itemColor(isOpen || moreActive)}`}
            >
              <Icon>{MORE_ICON}</Icon>
              Más
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

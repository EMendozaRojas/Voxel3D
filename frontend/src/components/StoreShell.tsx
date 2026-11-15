"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { StoreLayout } from "@/theme/layout/StoreLayout";

/**
 * Motor: reúne los datos que necesita la disposición de la tienda y se los
 * pasa a la carrocería (`StoreLayout`), que decide cómo se ve.
 */
export function StoreShell({ children }: { children: ReactNode }) {
  const currentPath = usePathname();
  // El carrito llega en el change `cart`; hasta entonces está vacío.
  const cartCount = 0;

  return (
    <StoreLayout currentPath={currentPath} cartCount={cartCount}>
      {children}
    </StoreLayout>
  );
}

import { bottomNavLinks, headerLinks, moreLinks } from "@/config/navigation";
import { DEMO_NOTICE, STORE_NAME } from "@/config/store";
import type { StoreLayoutProps } from "@/lib/theme-contract";

import { BottomNav } from "./BottomNav";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/**
 * Disposición de Voxel3D: cabecera arriba, contenido, pie y, en el móvil,
 * la barra inferior fija (por eso el contenido deja 80 px libres abajo).
 */
export function StoreLayout({ children, currentPath, cartCount }: StoreLayoutProps) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-50 rounded-pill bg-field px-4 py-2 text-on-field focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Saltar al contenido
      </a>
      <SiteHeader links={headerLinks} currentPath={currentPath} cartCount={cartCount} />
      <main id="contenido" className="flex flex-1 flex-col">
        {children}
      </main>
      <div className="pb-[calc(4rem+env(safe-area-inset-bottom,0px))] sm:pb-0">
        <SiteFooter storeName={STORE_NAME} demoNotice={DEMO_NOTICE} />
      </div>
      <BottomNav links={bottomNavLinks} moreLinks={moreLinks} currentPath={currentPath} />
    </>
  );
}

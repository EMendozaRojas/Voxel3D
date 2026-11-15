import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { showcaseCategories, showcaseLowStockThreshold, showcaseProducts } from "@/config/showcase";
import { getStockStatus } from "@/lib/stock";
import { Button } from "@/theme/ui/Button";
import { CategoryChips } from "@/theme/ui/CategoryChips";
import { ProductCard } from "@/theme/ui/ProductCard";
import { SearchBox } from "@/theme/ui/SearchBox";
import { StockBadge } from "@/theme/ui/StockBadge";

export const metadata: Metadata = { title: "Muestrario" };

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

/**
 * Muestrario (solo en desarrollo): enseña todas las piezas de la carrocería
 * que esté puesta, con datos de ejemplo de `config/showcase.ts`. Sirve para
 * revisar el diseño sin esperar a que existan el catálogo ni el carrito.
 */
export default function ShowcasePage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="mx-auto grid w-full max-w-6xl min-w-0 grid-cols-[minmax(0,1fr)] gap-10 px-4 py-8">
      <h1 className="text-2xl font-bold">Muestrario de piezas</h1>

      <Section title="Buscador">
        <SearchBox action="/productos" />
      </Section>

      <Section title="Chips de categoría">
        <CategoryChips options={showcaseCategories} />
      </Section>

      <Section title="Botones">
        <div className="flex flex-wrap gap-4">
          <Button>Añadir al carrito</Button>
          <Button disabled>Agotado</Button>
        </div>
      </Section>

      <Section title="Etiquetas de stock">
        <div className="flex flex-wrap gap-4">
          {[0, 3, 12].map((stock) => (
            <StockBadge key={stock} status={getStockStatus(stock, showcaseLowStockThreshold)} />
          ))}
        </div>
      </Section>

      <Section title="Tarjetas de producto">
        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] sm:gap-7">
          {showcaseProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lowStockThreshold={showcaseLowStockThreshold}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

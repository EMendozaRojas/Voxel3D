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

type SectionProps = { title: string; note?: string; children: ReactNode };

function Section({ title, note, children }: SectionProps) {
  return (
    <section className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
      <div className="grid gap-1">
        <h2 className="text-xl font-bold">{title}</h2>
        {note && <p className="text-sm opacity-80">{note}</p>}
      </div>
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
      <div className="grid gap-2">
        <h1 className="text-2xl font-bold">Muestrario de piezas</h1>
        <p className="max-w-prose opacity-80">
          Página de trabajo: solo existe en el ordenador de desarrollo, no en la tienda publicada.
          Enseña cada pieza suelta y, al final, montada en las tarjetas de producto.
        </p>
      </div>

      <Section title="Buscador">
        <SearchBox action="/productos" />
      </Section>

      <Section title="Chips de categoría">
        <CategoryChips options={showcaseCategories} />
      </Section>

      <Section
        title="Botones"
        note="Pieza suelta: en la tienda solo aparece dentro de la tarjeta de producto."
      >
        <div className="flex flex-wrap gap-4">
          <Button>Añadir al carrito</Button>
          <Button disabled>Agotado</Button>
        </div>
      </Section>

      <Section
        title="Etiquetas de stock"
        note="Pieza suelta: en la tienda solo aparece dentro de la tarjeta de producto."
      >
        <div className="flex flex-wrap gap-4">
          {[0, 3, 12].map((stock) => (
            <StockBadge key={stock} status={getStockStatus(stock, showcaseLowStockThreshold)} />
          ))}
        </div>
      </Section>

      <Section
        title="Tarjetas de producto"
        note="Las piezas anteriores, montadas como se verán en la tienda."
      >
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

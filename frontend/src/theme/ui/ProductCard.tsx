import Image from "next/image";

import { formatPrice } from "@/lib/format";
import { getStockStatus } from "@/lib/stock";
import type { ProductCardProps } from "@/lib/theme-contract";

import { Button } from "./Button";
import { StockBadge } from "./StockBadge";
import { VoxelCube } from "./VoxelCube";

/**
 * Tarjeta de producto de Voxel3D: marco metálico con remaches y barras de
 * cobre, foto sobre blanco con la etiqueta de stock, nombre, precio,
 * descripción corta y botón plata.
 */
export function ProductCard({ product, lowStockThreshold, onAddToCart }: ProductCardProps) {
  const status = getStockStatus(product.stock, lowStockThreshold);
  const soldOut = status.kind === "out";
  const titleId = `producto-${product.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="decor-rivets decor-bars grid gap-2 rounded-card border border-chip-border px-5 pt-[18px] pb-5 shadow-[0_10px_24px_rgb(0_0_0/0.35),inset_0_1px_0_rgb(255_255_255/0.12)]"
    >
      <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[10px] bg-photo bg-(image:--gradient-photo)">
        {product.image ? (
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(max-width: 640px) 50vw, 280px"
            className="object-contain"
          />
        ) : (
          <VoxelCube className="w-1/3" />
        )}
        <span className="absolute top-2 left-2">
          <StockBadge status={status} />
        </span>
      </div>

      <h3 id={titleId} className="mt-1 text-lg font-bold">
        {product.name}
      </h3>
      <p className="text-xl font-bold tabular-nums">{formatPrice(product.priceCents)}</p>
      <p className="text-sm text-text-muted">{product.shortDescription}</p>

      <Button
        className="mt-1.5"
        disabled={soldOut}
        onClick={onAddToCart}
        aria-label={soldOut ? "Agotado" : "Añadir al carrito"}
      >
        {soldOut ? (
          "Agotado"
        ) : (
          <>
            <span className="sm:hidden">Añadir</span>
            <span className="hidden sm:inline">Añadir al carrito</span>
          </>
        )}
      </Button>
    </article>
  );
}

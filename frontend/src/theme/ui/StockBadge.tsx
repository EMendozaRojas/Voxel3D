import type { StockBadgeProps } from "@/lib/theme-contract";

/** Etiqueta de stock de Voxel3D: píldora de cobre con el texto del motor. */
export function StockBadge({ status }: StockBadgeProps) {
  return (
    <span
      data-stock={status.kind}
      className="inline-block rounded-pill bg-stock bg-(image:--gradient-stock) px-2.5 py-0.5 font-label text-[13px] font-bold tracking-[1px] text-on-stock uppercase"
    >
      {status.label}
    </span>
  );
}

import Link from "next/link";

import type { NotFoundViewProps } from "@/lib/theme-contract";

import { VoxelCube } from "../ui/VoxelCube";

/** Página 404 de Voxel3D: marco metálico con el cubo y un botón para volver. */
export function NotFoundView({ homeHref }: NotFoundViewProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <section
        aria-labelledby="no-encontrado"
        className="decor-rivets decor-bars grid w-full max-w-md justify-items-center gap-4 rounded-card border border-chip-border px-8 py-9 text-center shadow-[0_10px_24px_rgb(0_0_0/0.35)]"
      >
        <VoxelCube className="w-16" />
        <p className="font-logo text-5xl text-accent-text">404</p>
        <h1 id="no-encontrado" className="font-label text-2xl font-bold tracking-[1px] uppercase">
          Página no encontrada
        </h1>
        <p className="text-text-muted">Esta página no existe o todavía está en construcción.</p>
        <Link
          href={homeHref}
          className="mt-2 inline-flex min-h-11 items-center rounded-pill bg-button bg-(image:--gradient-button) px-6 font-label font-bold tracking-[1px] text-on-button uppercase hover:brightness-105"
        >
          Volver al inicio
        </Link>
      </section>
    </div>
  );
}

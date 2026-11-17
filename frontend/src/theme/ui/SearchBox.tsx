import type { SearchBoxProps } from "@/lib/theme-contract";

import { VoxelCube } from "./VoxelCube";

/**
 * Buscador de Voxel3D: píldora oscura de 52 px con el cubo voxel a la
 * derecha (el único cubo del diseño). La etiqueta está oculta a la vista
 * pero la leen los lectores de pantalla.
 */
export function SearchBox({ action, defaultValue }: SearchBoxProps) {
  return (
    <form role="search" action={action} className="w-full">
      <label htmlFor="buscador" className="sr-only">
        Buscar productos
      </label>
      <div className="flex h-[52px] items-center gap-2.5 rounded-pill border border-field-border bg-field pr-3.5 pl-5 shadow-[inset_0_2px_6px_rgb(0_0_0/0.7)] focus-within:border-accent focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent-text">
        <input
          id="buscador"
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Buscar productos 3D de alta tecnología…"
          className="h-full w-full min-w-0 flex-1 bg-transparent text-on-field placeholder:text-text-muted focus:outline-none"
        />
        <VoxelCube className="size-7 shrink-0" />
      </div>
    </form>
  );
}

"use client";

import { useId } from "react";

import { useCategoryChips } from "@/hooks/useCategoryChips";
import type { CategoryChipsProps } from "@/lib/theme-contract";

/** En el móvil se ven tres chips; el resto, en el panel "Más". */
const VISIBLE_ON_MOBILE = 3;

const chip =
  "inline-flex min-h-11 items-center rounded-pill border px-4 font-label font-semibold tracking-[1px] uppercase";
const chipColor = (active: boolean) =>
  active
    ? "border-transparent bg-chip-active bg-(image:--gradient-chip-active) text-on-chip-active"
    : "border-chip-border bg-chip bg-(image:--gradient-chip) text-on-chip hover:border-accent";

/**
 * Chips de categoría de Voxel3D. En escritorio se ven todos; en el móvil,
 * los tres primeros y un botón "Más" que abre un panel con el resto.
 */
export function CategoryChips({ options, initialValue, onChange }: CategoryChipsProps) {
  const {
    selected,
    select,
    visible,
    overflow,
    moreLabel,
    moreActive,
    isOpen,
    toggle,
    containerRef,
  } = useCategoryChips({ options, visibleCount: VISIBLE_ON_MOBILE, initialValue, onChange });
  const panelId = useId();

  return (
    <div role="group" aria-label="Categorías" className="flex flex-wrap gap-2.5">
      {visible.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={selected === option.value}
          onClick={() => select(option.value)}
          className={`${chip} ${chipColor(selected === option.value)}`}
        >
          {option.label}
        </button>
      ))}

      {/* En escritorio, el resto de chips va en la misma fila. */}
      {overflow.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={selected === option.value}
          onClick={() => select(option.value)}
          className={`${chip} ${chipColor(selected === option.value)} hidden sm:inline-flex`}
        >
          {option.label}
        </button>
      ))}

      {/* En el móvil, el botón "Más" y su panel. */}
      {overflow.length > 0 && (
        <div ref={containerRef} className="relative sm:hidden">
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={toggle}
            className={`${chip} ${chipColor(moreActive)} gap-1.5`}
          >
            {moreLabel}
            <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3 fill-current">
              <path d={isOpen ? "M2 8l4-4 4 4z" : "M2 4l4 4 4-4z"} />
            </svg>
          </button>
          <div
            id={panelId}
            hidden={!isOpen}
            className="absolute top-full left-0 z-30 mt-2 grid min-w-44 gap-2 rounded-card border border-chip-border bg-header p-3 shadow-[0_12px_30px_rgb(0_0_0/0.5)]"
          >
            {overflow.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected === option.value}
                onClick={() => select(option.value)}
                className={`${chip} ${chipColor(selected === option.value)}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

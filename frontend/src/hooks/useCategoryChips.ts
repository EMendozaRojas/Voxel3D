"use client";

import { useState } from "react";

import { useDisclosure } from "./useDisclosure";

/** Una categoría como chip: `value` la identifica y `label` es su nombre corto. */
export type CategoryOption = { value: string; label: string };

type Options = {
  options: CategoryOption[];
  /** Cuántos chips se ven en el móvil antes del botón "Más". */
  visibleCount: number;
  initialValue?: string;
  onChange?: (value: string) => void;
  /** Texto del botón cuando la categoría elegida no está en el panel. */
  moreText?: string;
};

/**
 * Reglas de los chips de categoría:
 * - los `visibleCount` primeros se ven siempre; el resto va al panel "Más";
 * - elegir una categoría la marca y cierra el panel;
 * - si la elegida está en el panel, el botón "Más" lleva su nombre y se marca.
 */
export function useCategoryChips({
  options,
  visibleCount,
  initialValue = options[0]?.value ?? "",
  onChange,
  moreText = "Más",
}: Options) {
  const [selected, setSelected] = useState(initialValue);
  const { isOpen, toggle, close, containerRef } = useDisclosure<HTMLDivElement>();

  const visible = options.slice(0, visibleCount);
  const overflow = options.slice(visibleCount);
  const selectedInOverflow = overflow.find((option) => option.value === selected);

  function select(value: string) {
    setSelected(value);
    close();
    onChange?.(value);
  }

  return {
    selected,
    select,
    visible,
    overflow,
    moreLabel: selectedInOverflow?.label ?? moreText,
    moreActive: selectedInOverflow !== undefined,
    isOpen,
    toggle,
    containerRef,
  };
}

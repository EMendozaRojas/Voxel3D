"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Abrir y cerrar un panel (menú, panel "Más"…).
 *
 * Mientras está abierto se cierra:
 * - con la tecla `Escape`;
 * - pulsando fuera de `containerRef` (el elemento que envuelve el botón y el
 *   panel; así pulsar el propio botón no cuenta como "fuera").
 */
export function useDisclosure<T extends HTMLElement = HTMLElement>(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const containerRef = useRef<T>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      const container = containerRef.current;
      if (container && !container.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  return { isOpen, open, close, toggle, containerRef };
}

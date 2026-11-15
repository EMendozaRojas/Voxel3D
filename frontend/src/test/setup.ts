// Añade comprobaciones legibles a los tests, como toBeInTheDocument().
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  // Cada test empieza con la pantalla vacía y sin fetch simulado.
  cleanup();
  vi.unstubAllGlobals();
});

// next/font/google solo funciona dentro de Next.js (descarga las fuentes al
// construir). En los tests, cualquier fuente que importe la carrocería
// (Russo_One, Quicksand…) devuelve solo su variable CSS: así cada tienda
// puede elegir sus fuentes sin tocar este archivo.
vi.mock("next/font/google", () => {
  const font = (options: { variable?: string } = {}) => ({
    className: "font-de-prueba",
    variable: options.variable ?? "",
    style: { fontFamily: "font-de-prueba" },
  });
  // Un objeto que responde a cualquier nombre de fuente ("then" no, para que
  // no se confunda con una promesa).
  return new Proxy(
    {},
    {
      has: (_target, name) => name !== "then",
      get: (_target, name) => (name === "then" ? undefined : font),
    },
  );
});

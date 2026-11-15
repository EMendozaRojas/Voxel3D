// Añade comprobaciones legibles a los tests, como toBeInTheDocument().
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  // Cada test empieza con la pantalla vacía y sin fetch simulado.
  cleanup();
  vi.unstubAllGlobals();
});

// next/font solo funciona dentro de Next.js (prepara las fuentes al
// construir). En los tests, cualquier fuente de la carrocería, de Google
// (Russo_One, Quicksand…) o propia (next/font/local), devuelve solo su
// variable CSS: así cada tienda elige sus fuentes sin tocar este archivo.
function fakeFont(options: { variable?: string } = {}) {
  return {
    className: "font-de-prueba",
    variable: options.variable ?? "",
    style: { fontFamily: "font-de-prueba" },
  };
}

vi.mock("next/font/google", () => {
  // Un objeto que responde a cualquier nombre de fuente ("then" no, para que
  // no se confunda con una promesa).
  return new Proxy(
    {},
    {
      has: (_target, name) => name !== "then",
      get: (_target, name) => (name === "then" ? undefined : fakeFont),
    },
  );
});

vi.mock("next/font/local", () => ({ default: fakeFont }));

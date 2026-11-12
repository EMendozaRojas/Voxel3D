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
// construir). En los tests, cada fuente devuelve solo su variable CSS.
vi.mock("next/font/google", () => {
  const font = (options: { variable?: string }) => ({
    className: "font-de-prueba",
    variable: options.variable ?? "",
    style: { fontFamily: "font-de-prueba" },
  });
  return { Arimo: font, Rajdhani: font, Russo_One: font };
});

// Añade comprobaciones legibles a los tests, como toBeInTheDocument().
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  // Cada test empieza con la pantalla vacía y sin fetch simulado.
  cleanup();
  vi.unstubAllGlobals();
});

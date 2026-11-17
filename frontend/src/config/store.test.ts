import { describe, expect, it } from "vitest";

import { readStoreName, STORE_NAME } from "./store";

describe("Nombre de la tienda", () => {
  it("se lee de NEXT_PUBLIC_STORE_NAME", () => {
    // vitest.config.mts pone un nombre de prueba, distinto de cualquier tienda real.
    expect(STORE_NAME).toBe("Tienda de prueba");
  });

  it("quita los espacios sobrantes", () => {
    expect(readStoreName("  Sakuribella ")).toBe("Sakuribella");
  });

  it.each([undefined, "", "   "])("si falta (%j), el error nombra la variable", (value) => {
    expect(() => readStoreName(value)).toThrow(/NEXT_PUBLIC_STORE_NAME/);
  });
});

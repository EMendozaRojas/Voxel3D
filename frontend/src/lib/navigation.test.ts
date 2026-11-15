import { describe, expect, it } from "vitest";

import { isActivePath } from "./navigation";

describe("isActivePath", () => {
  it("la portada solo está activa en la portada", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/productos", "/")).toBe(false);
    expect(isActivePath("/productos/macetas", "/")).toBe(false);
  });

  it("un enlace está activo en su página", () => {
    expect(isActivePath("/productos", "/productos")).toBe(true);
  });

  it("un enlace está activo en las páginas que cuelgan de él", () => {
    expect(isActivePath("/productos/macetas", "/productos")).toBe(true);
  });

  it("no se activa con una página que solo empieza igual", () => {
    expect(isActivePath("/productos-nuevos", "/productos")).toBe(false);
  });

  it("no se activa en otra página", () => {
    expect(isActivePath("/cuenta", "/productos")).toBe(false);
  });
});

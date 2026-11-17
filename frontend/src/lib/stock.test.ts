import { describe, expect, it } from "vitest";

import { getStockStatus } from "./stock";

describe("getStockStatus", () => {
  it("sin stock: Agotado", () => {
    expect(getStockStatus(0, 5)).toEqual({ kind: "out", label: "Agotado" });
  });

  it("pocas unidades: Quedan 3 (stock 3, umbral 5)", () => {
    expect(getStockStatus(3, 5)).toEqual({ kind: "low", label: "Quedan 3" });
  });

  it("justo en el umbral cuenta como pocas unidades", () => {
    expect(getStockStatus(5, 5)).toEqual({ kind: "low", label: "Quedan 5" });
  });

  it("stock suficiente: En stock (stock 12, umbral 5)", () => {
    expect(getStockStatus(12, 5)).toEqual({ kind: "in", label: "En stock" });
  });

  it("un stock negativo (error de datos) se trata como agotado", () => {
    expect(getStockStatus(-1, 5).kind).toBe("out");
  });
});

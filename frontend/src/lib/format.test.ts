import { describe, expect, it } from "vitest";

import { formatPrice } from "./format";

// Intl separa la cifra del símbolo con un espacio que no se parte (U+00A0).
const nbsp = (text: string) => text.replace(" ", " ");

describe("formatPrice", () => {
  it("convierte céntimos en euros con formato español", () => {
    expect(formatPrice(1490)).toBe(nbsp("14,90 €"));
  });

  it("cero se muestra con dos decimales", () => {
    expect(formatPrice(0)).toBe(nbsp("0,00 €"));
  });

  it("siempre lleva dos decimales", () => {
    expect(formatPrice(500)).toBe(nbsp("5,00 €"));
    expect(formatPrice(1)).toBe(nbsp("0,01 €"));
  });

  it("usa la moneda y el idioma que se le pidan", () => {
    expect(formatPrice(1490, "en-US", "USD")).toBe("$14.90");
  });
});

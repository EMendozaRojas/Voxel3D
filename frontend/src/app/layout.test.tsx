import { describe, expect, it } from "vitest";

import { metadata } from "./layout";

describe("Título de la pestaña", () => {
  it("la portada lleva el nombre de la tienda", () => {
    expect(metadata.title).toMatchObject({ default: "Tienda de prueba" });
  });

  it("las demás páginas añaden el nombre de la tienda detrás del suyo", () => {
    expect(metadata.title).toMatchObject({ template: "%s · Tienda de prueba" });
  });
});

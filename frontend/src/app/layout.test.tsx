import { describe, expect, it } from "vitest";

import RootLayout, { metadata } from "./layout";

describe("Título de la pestaña", () => {
  it("la portada lleva el nombre de la tienda", () => {
    expect(metadata.title).toMatchObject({ default: "Tienda de prueba" });
  });

  it("las demás páginas añaden el nombre de la tienda detrás del suyo", () => {
    expect(metadata.title).toMatchObject({ template: "%s · Tienda de prueba" });
  });
});

describe("Estructura del documento", () => {
  it("está en español y lleva las variables de las fuentes", () => {
    const html = RootLayout({ children: null, params: Promise.resolve({}) });
    expect(html.props.lang).toBe("es");
    expect(html.props.className).toContain("--font-store-body");
  });
});

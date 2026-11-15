import { describe, expect, it } from "vitest";

import { isActivePath } from "@/lib/navigation";

import { bottomNavLinks, headerLinks } from "./navigation";

/** Textos de los enlaces que se marcan como página actual. */
function activeLabels(links: typeof headerLinks, path: string): string[] {
  return links.filter((link) => isActivePath(path, link.href)).map((link) => link.label);
}

describe("Enlaces de la tienda", () => {
  it.each([
    ["/", "Inicio"],
    ["/productos", "Productos"],
    ["/productos/macetas", "Productos"],
    ["/sobre-nosotros", "Sobre nosotros"],
  ])("en la cabecera, %s marca solo «%s»", (path, label) => {
    expect(activeLabels(headerLinks, path)).toEqual([label]);
  });

  it.each([
    ["/", "Inicio"],
    ["/productos/macetas", "Productos"],
    ["/cuenta", "Cuenta"],
  ])("en la barra inferior, %s marca solo «%s»", (path, label) => {
    expect(activeLabels(bottomNavLinks, path)).toEqual([label]);
  });

  it("la barra inferior tiene los cuatro enlaces de DISENO.md", () => {
    expect(bottomNavLinks.map((link) => link.label)).toEqual([
      "Inicio",
      "Productos",
      "Cuenta",
      "Más",
    ]);
  });
});

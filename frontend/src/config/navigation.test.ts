import { describe, expect, it } from "vitest";

import { isActivePath } from "@/lib/navigation";

import { bottomNavLinks, headerLinks, moreLinks } from "./navigation";

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

  it("la barra inferior tiene Inicio, Productos y Cuenta (Más es un botón aparte)", () => {
    expect(bottomNavLinks.map((link) => link.label)).toEqual(["Inicio", "Productos", "Cuenta"]);
  });

  it("todo enlace de la cabecera está en la barra inferior o en Más", () => {
    const mobile = [...bottomNavLinks, ...moreLinks].map((link) => link.href);
    for (const link of headerLinks) expect(mobile).toContain(link.href);
  });
});

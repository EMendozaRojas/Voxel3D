import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { headerLinks } from "@/config/navigation";

import { SiteHeader } from "./SiteHeader";

function renderHeader(currentPath = "/", cartCount = 0) {
  render(<SiteHeader links={headerLinks} currentPath={currentPath} cartCount={cartCount} />);
}

describe("SiteHeader", () => {
  it("es una cabecera real con el logo y el menú principal", () => {
    renderHeader();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tienda de prueba" })).toHaveAttribute("href", "/");
    const menu = screen.getByRole("navigation", { name: "Menú principal" });
    expect(
      within(menu)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(["Inicio", "Productos", "Sobre nosotros"]);
  });

  it("marca la página activa con aria-current y solo esa", () => {
    renderHeader("/productos/macetas");
    const menu = screen.getByRole("navigation", { name: "Menú principal" });
    expect(within(menu).getByRole("link", { name: "Productos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(menu).getByRole("link", { name: "Inicio" })).not.toHaveAttribute("aria-current");
  });

  it("con 3 unidades, el carrito muestra 3 y lo dice en su nombre", () => {
    renderHeader("/", 3);
    const cart = screen.getByRole("link", { name: "Carrito, 3 productos" });
    expect(cart).toHaveAttribute("href", "/carrito");
    expect(cart).toHaveTextContent("3");
  });

  it("con 1 unidad, el nombre va en singular", () => {
    renderHeader("/", 1);
    expect(screen.getByRole("link", { name: "Carrito, 1 producto" })).toBeInTheDocument();
  });

  it("con el carrito vacío no hay contador", () => {
    renderHeader("/", 0);
    const cart = screen.getByRole("link", { name: "Carrito" });
    expect(cart).toHaveTextContent("");
  });

  it("los botones de icono se anuncian como «Mi cuenta» y «Carrito»", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: "Mi cuenta" })).toHaveAttribute("href", "/cuenta");
    expect(screen.getByRole("link", { name: "Carrito" })).toBeInTheDocument();
  });
});

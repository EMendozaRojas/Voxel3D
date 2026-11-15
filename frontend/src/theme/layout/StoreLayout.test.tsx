import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StoreLayout } from "./StoreLayout";

function renderLayout(currentPath = "/") {
  render(
    <StoreLayout currentPath={currentPath} cartCount={2}>
      <p>Contenido de la página</p>
    </StoreLayout>,
  );
}

describe("StoreLayout", () => {
  it("pone cabecera, contenido principal, pie y barra del móvil", () => {
    renderLayout();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Contenido de la página");
    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      "Modo demostración: no se cobra dinero real.",
    );
    expect(screen.getByRole("navigation", { name: "Menú del móvil" })).toBeInTheDocument();
  });

  it("pasa la página actual al menú y a la barra del móvil", () => {
    renderLayout("/productos");
    const menu = screen.getByRole("navigation", { name: "Menú principal" });
    const mobile = screen.getByRole("navigation", { name: "Menú del móvil" });
    expect(within(menu).getByRole("link", { name: "Productos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(mobile).getByRole("link", { name: "Productos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("pasa el carrito a la cabecera", () => {
    renderLayout();
    expect(screen.getByRole("link", { name: "Carrito, 2 productos" })).toBeInTheDocument();
  });

  it("tiene un enlace para saltar al contenido", () => {
    renderLayout();
    expect(screen.getByRole("link", { name: "Saltar al contenido" })).toHaveAttribute(
      "href",
      "#contenido",
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "contenido");
  });
});

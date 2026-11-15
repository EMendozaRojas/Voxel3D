import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StoreShell } from "./StoreShell";

// usePathname solo funciona dentro de Next.js: aquí simulamos que la
// persona está en /productos/macetas.
vi.mock("next/navigation", () => ({ usePathname: () => "/productos/macetas" }));

describe("StoreShell", () => {
  it("pasa la página actual de la dirección a la carrocería", () => {
    render(<StoreShell>contenido</StoreShell>);
    const menu = screen.getByRole("navigation", { name: "Menú principal" });
    expect(within(menu).getByRole("link", { name: "Productos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("main")).toHaveTextContent("contenido");
  });

  it("mientras no exista el carrito, lo muestra vacío", () => {
    render(<StoreShell>contenido</StoreShell>);
    expect(screen.getByRole("link", { name: "Carrito" })).toBeInTheDocument();
  });
});

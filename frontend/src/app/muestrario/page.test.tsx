import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ShowcasePage, { metadata } from "./page";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Muestrario", () => {
  it("se titula Muestrario", () => {
    expect(metadata.title).toBe("Muestrario");
  });

  it("en desarrollo muestra todas las piezas con datos de ejemplo", () => {
    vi.stubEnv("NODE_ENV", "development");
    render(<ShowcasePage />);
    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Categorías" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Añadir al carrito" }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Agotado").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Quedan 3").length).toBeGreaterThan(0);
    expect(screen.getAllByText("En stock").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });

  it("explica que el botón y las etiquetas son piezas sueltas", () => {
    vi.stubEnv("NODE_ENV", "development");
    render(<ShowcasePage />);
    expect(
      screen.getAllByText(
        "Pieza suelta: en la tienda solo aparece dentro de la tarjeta de producto.",
      ),
    ).toHaveLength(2);
  });

  it("en producción no existe (página de no encontrado)", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => render(<ShowcasePage />)).toThrow("NEXT_NOT_FOUND");
  });
});

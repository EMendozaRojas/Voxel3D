import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { ProductSummary } from "@/lib/theme-contract";

import { ProductCard } from "./ProductCard";

const maceta: ProductSummary = {
  id: "maceta",
  name: "Maceta geométrica",
  priceCents: 1490,
  shortDescription: "PLA · Negro",
  stock: 3,
};

describe("ProductCard", () => {
  it("muestra nombre, precio en formato español, descripción y stock", () => {
    render(<ProductCard product={maceta} lowStockThreshold={5} />);
    const card = screen.getByRole("article", { name: "Maceta geométrica" });
    expect(card).toHaveTextContent(/14,90\s€/);
    expect(card).toHaveTextContent("PLA · Negro");
    expect(card).toHaveTextContent("Quedan 3");
  });

  it("con stock, el botón añade al carrito", async () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={maceta} lowStockThreshold={5} onAddToCart={onAddToCart} />);
    await userEvent.click(screen.getByRole("button", { name: "Añadir al carrito" }));
    expect(onAddToCart).toHaveBeenCalledOnce();
  });

  it("agotado: el botón dice Agotado y está desactivado", async () => {
    const onAddToCart = vi.fn();
    render(
      <ProductCard
        product={{ ...maceta, stock: 0 }}
        lowStockThreshold={5}
        onAddToCart={onAddToCart}
      />,
    );
    const button = screen.getByRole("button", { name: "Agotado" });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onAddToCart).not.toHaveBeenCalled();
  });

  it("con foto, la muestra con su texto alternativo", () => {
    render(
      <ProductCard
        product={{ ...maceta, image: { src: "/maceta.png", alt: "Maceta negra de caras" } }}
        lowStockThreshold={5}
      />,
    );
    expect(screen.getByRole("img", { name: "Maceta negra de caras" })).toBeInTheDocument();
  });

  it("sin foto, el marcador es decorativo (no es una imagen para el lector)", () => {
    render(<ProductCard product={maceta} lowStockThreshold={5} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

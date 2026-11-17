import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Logo } from "./Logo";

describe("Logo", () => {
  it("por defecto escribe el nombre de la tienda de la configuración", () => {
    render(<Logo />);
    expect(screen.getByRole("link", { name: "Tienda de prueba" })).toBeInTheDocument();
  });

  it("de texto: muestra el nombre y enlaza a la portada", () => {
    render(<Logo brand={{ type: "text" }} storeName="Mi tienda" />);
    expect(screen.getByRole("link", { name: "Mi tienda" })).toHaveAttribute("href", "/");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("de imagen: muestra la imagen con su alt y enlaza a la portada", () => {
    render(
      <Logo
        brand={{
          type: "image",
          src: "/logo.png",
          alt: "Logo de Mi tienda",
          width: 200,
          height: 60,
        }}
        storeName="Mi tienda"
      />,
    );
    expect(screen.getByRole("img", { name: "Logo de Mi tienda" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Logo de Mi tienda" })).toHaveAttribute("href", "/");
    expect(screen.queryByText("Mi tienda")).not.toBeInTheDocument();
  });
});

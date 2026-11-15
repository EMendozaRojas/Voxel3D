import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SearchBox } from "./SearchBox";

describe("SearchBox", () => {
  it("se anuncia como búsqueda y el campo tiene su etiqueta", () => {
    render(<SearchBox action="/productos" />);
    expect(screen.getByRole("search")).toHaveAttribute("action", "/productos");
    const field = screen.getByRole("searchbox", { name: "Buscar productos" });
    expect(field).toHaveAttribute("name", "q");
  });

  it("puede empezar con una búsqueda escrita", () => {
    render(<SearchBox action="/productos" defaultValue="maceta" />);
    expect(screen.getByRole("searchbox")).toHaveValue("maceta");
  });

  it("el cubo es decorativo", () => {
    render(<SearchBox action="/productos" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

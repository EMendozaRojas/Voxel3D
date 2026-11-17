import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound, { metadata } from "./not-found";

describe("Página no encontrada", () => {
  it("se titula «Página no encontrada»", () => {
    expect(metadata.title).toBe("Página no encontrada");
  });

  it("lo explica y ofrece volver al inicio", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { name: "Página no encontrada" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/");
  });
});

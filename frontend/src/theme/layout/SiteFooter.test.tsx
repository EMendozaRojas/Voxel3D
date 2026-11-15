import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DEMO_NOTICE } from "@/config/store";

import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("es un pie real con el aviso de modo demostración", () => {
    render(<SiteFooter storeName="Tienda de prueba" demoNotice={DEMO_NOTICE} />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent("Modo demostración: no se cobra dinero real.");
    expect(footer).toHaveTextContent("Tienda de prueba");
  });

  it("muestra el aviso entero aunque no lleve dos puntos", () => {
    render(<SiteFooter storeName="Tienda de prueba" demoNotice="Solo pruebas" />);
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Solo pruebas");
  });
});

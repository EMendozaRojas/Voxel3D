import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Providers } from "@/components/Providers";

import Home from "./page";

describe("Portada", () => {
  it("con los Providers reales, muestra que el servidor está conectado", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: "ok", database: "ok" }),
      }),
    );

    render(
      <Providers>
        <Home />
      </Providers>,
    );

    expect(screen.getByRole("heading", { name: "Estado del servidor" })).toBeInTheDocument();
    expect(await screen.findByText(/conectado: el servidor funciona/i)).toBeInTheDocument();
  });
});

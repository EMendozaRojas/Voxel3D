import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HealthStatus } from "./HealthStatus";

const CONECTADO = /conectado: el servidor funciona/i;
const ERROR = /no se puede conectar con el servidor/i;

/** Respuesta falsa de fetch con un código HTTP y un cuerpo JSON. */
function respuesta(status: number, body: unknown) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

/** Cada test tiene su propio QueryClient, sin reintentos automáticos. */
function renderHealthStatus() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <HealthStatus />
    </QueryClientProvider>,
  );
}

describe("HealthStatus", () => {
  it("muestra el título genérico, sin nombre de tienda", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
    renderHealthStatus();

    expect(screen.getByRole("heading", { name: "Estado del servidor" })).toBeInTheDocument();
  });

  it("muestra el estado de carga mientras espera al servidor", () => {
    // Una promesa que nunca termina: el servidor no contesta todavía.
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
    renderHealthStatus();

    expect(screen.getByRole("status")).toHaveTextContent(/comprobando la conexión/i);
  });

  it("muestra conectado cuando el servidor responde bien", async () => {
    const fetchMock = vi.fn().mockResolvedValue(respuesta(200, { status: "ok", database: "ok" }));
    vi.stubGlobal("fetch", fetchMock);
    renderHealthStatus();

    expect(await screen.findByText(CONECTADO)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8000/api/v1/health");
    expect(screen.queryByRole("button", { name: "Reintentar" })).not.toBeInTheDocument();
  });

  it("muestra error y botón de reintento si la base de datos no responde (503)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(respuesta(503, { status: "error", database: "unavailable" })),
    );
    renderHealthStatus();

    expect(await screen.findByText(ERROR)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeEnabled();
  });

  it("muestra error si el servidor no se puede alcanzar", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    renderHealthStatus();

    expect(await screen.findByText(ERROR)).toBeInTheDocument();
  });

  it("muestra error si el servidor responde 200 pero dice que algo va mal", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(respuesta(200, { status: "error", database: "unavailable" })),
    );
    renderHealthStatus();

    expect(await screen.findByText(ERROR)).toBeInTheDocument();
  });

  it("el botón Reintentar vuelve a pedir el estado y muestra conectado", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(respuesta(200, { status: "ok", database: "ok" }));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderHealthStatus();

    await user.click(await screen.findByRole("button", { name: "Reintentar" }));

    expect(await screen.findByText(CONECTADO)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("al reintentar vuelve al estado de carga y quita el botón", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockReturnValueOnce(new Promise(() => {}));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderHealthStatus();

    await user.click(await screen.findByRole("button", { name: "Reintentar" }));

    expect(await screen.findByText(/comprobando la conexión/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Reintentar" })).not.toBeInTheDocument();
  });
});

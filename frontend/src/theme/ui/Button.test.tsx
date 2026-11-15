import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("es un botón real que llama a su acción", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Añadir al carrito</Button>);
    const button = screen.getByRole("button", { name: "Añadir al carrito" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("desactivado: se anuncia como desactivado y no llama a su acción", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Agotado
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Agotado" });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("puede enviar un formulario si se le pide", () => {
    render(<Button type="submit">Pagar</Button>);
    expect(screen.getByRole("button", { name: "Pagar" })).toHaveAttribute("type", "submit");
  });
});

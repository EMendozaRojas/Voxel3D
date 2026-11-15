import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { useDisclosure } from "./useDisclosure";

/** Un botón y su panel dentro del contenedor, y otro botón fuera. */
function Demo() {
  const { isOpen, toggle, containerRef } = useDisclosure<HTMLDivElement>();
  return (
    <>
      <div ref={containerRef}>
        <button type="button" aria-expanded={isOpen} onClick={toggle}>
          Más
        </button>
        {isOpen && <p>Panel abierto</p>}
      </div>
      <button type="button">Fuera</button>
    </>
  );
}

describe("useDisclosure", () => {
  it("empieza cerrado y se abre, cierra y alterna", () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
  });

  it("puede empezar abierto", () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.isOpen).toBe(true);
  });

  it("se cierra con Escape", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole("button", { name: "Más" }));
    expect(screen.getByText("Panel abierto")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByText("Panel abierto")).not.toBeInTheDocument();
  });

  it("se cierra pulsando fuera", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole("button", { name: "Más" }));
    await user.click(screen.getByRole("button", { name: "Fuera" }));
    expect(screen.queryByText("Panel abierto")).not.toBeInTheDocument();
  });

  it("pulsar dentro no lo cierra y el botón lo alterna", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const button = screen.getByRole("button", { name: "Más" });
    await user.click(button);
    await user.click(screen.getByText("Panel abierto"));
    expect(screen.getByText("Panel abierto")).toBeInTheDocument();
    await user.click(button);
    expect(screen.queryByText("Panel abierto")).not.toBeInTheDocument();
  });

  it("otras teclas no lo cierran", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole("button", { name: "Más" }));
    await user.keyboard("a");
    expect(screen.getByText("Panel abierto")).toBeInTheDocument();
  });
});

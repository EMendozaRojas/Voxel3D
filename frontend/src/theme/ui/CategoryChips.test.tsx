import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { CategoryOption } from "@/hooks/useCategoryChips";

import { CategoryChips } from "./CategoryChips";

const options: CategoryOption[] = [
  { value: "", label: "Todos" },
  { value: "hogar", label: "Hogar" },
  { value: "animales", label: "Animales" },
  { value: "geek", label: "Geek" },
  { value: "lamparas", label: "Lámparas" },
];

function renderChips(onChange = vi.fn()) {
  render(
    <>
      <CategoryChips options={options} onChange={onChange} />
      <p>Fuera</p>
    </>,
  );
  const more = screen.getByRole("button", { name: "Más" });
  const panel = document.getElementById(more.getAttribute("aria-controls")!)!;
  return { more, panel, onChange };
}

describe("CategoryChips", () => {
  it("marca la categoría elegida con aria-pressed", async () => {
    renderChips();
    const group = screen.getByRole("group", { name: "Categorías" });
    expect(within(group).getByRole("button", { name: "Todos" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await userEvent.click(within(group).getByRole("button", { name: "Hogar" }));
    expect(within(group).getByRole("button", { name: "Hogar" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(group).getByRole("button", { name: "Todos" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("Más abre un panel con el resto de categorías", async () => {
    const { more, panel } = renderChips();
    expect(more).toHaveAttribute("aria-expanded", "false");
    expect(panel).not.toBeVisible();
    await userEvent.click(more);
    expect(more).toHaveAttribute("aria-expanded", "true");
    expect(
      within(panel)
        .getAllByRole("button")
        .map((b) => b.textContent),
    ).toEqual(["Geek", "Lámparas"]);
  });

  it("elegir una del panel: se cierra, Más lleva su nombre y queda marcado", async () => {
    const { more, panel, onChange } = renderChips();
    await userEvent.click(more);
    await userEvent.click(within(panel).getByRole("button", { name: "Geek" }));
    expect(panel).not.toBeVisible();
    const renamed = screen.getByRole("button", { name: "Geek", expanded: false });
    expect(renamed).toBe(more);
    expect(onChange).toHaveBeenCalledWith("geek");
  });

  it("el panel se cierra con Escape", async () => {
    const { more, panel } = renderChips();
    await userEvent.click(more);
    await userEvent.keyboard("{Escape}");
    expect(panel).not.toBeVisible();
  });

  it("el panel se cierra pulsando fuera", async () => {
    const { more, panel } = renderChips();
    await userEvent.click(more);
    await userEvent.click(screen.getByText("Fuera"));
    expect(panel).not.toBeVisible();
  });

  it("con tres categorías o menos no hay botón Más", () => {
    render(<CategoryChips options={options.slice(0, 3)} />);
    expect(screen.queryByRole("button", { name: "Más" })).not.toBeInTheDocument();
  });
});

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { bottomNavLinks, moreLinks } from "@/config/navigation";

import { BottomNav } from "./BottomNav";

function renderNav(currentPath = "/") {
  render(
    <>
      <p>Contenido de la página</p>
      <BottomNav links={bottomNavLinks} moreLinks={moreLinks} currentPath={currentPath} />
    </>,
  );
  return screen.getByRole("navigation", { name: "Menú del móvil" });
}

describe("BottomNav", () => {
  it("tiene Inicio, Productos y Cuenta como enlaces y Más como botón", () => {
    const nav = renderNav();
    expect(
      within(nav)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(["Inicio", "Productos", "Cuenta"]);
    expect(within(nav).getByRole("button", { name: "Más" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("marca la página actual con aria-current", () => {
    const nav = renderNav("/productos/macetas");
    expect(within(nav).getByRole("link", { name: "Productos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(nav).getByRole("link", { name: "Inicio" })).not.toHaveAttribute("aria-current");
  });

  it("Más abre el panel con el resto de enlaces y lo anuncia", async () => {
    const user = userEvent.setup();
    const nav = renderNav("/sobre-nosotros");
    await user.click(within(nav).getByRole("button", { name: "Más" }));
    expect(within(nav).getByRole("button", { name: "Más" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(within(nav).getByRole("link", { name: "Sobre nosotros" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("con el teclado: Más se abre con Enter y Tab llega a sus enlaces", async () => {
    const user = userEvent.setup();
    const nav = renderNav();
    within(nav).getByRole("button", { name: "Más" }).focus();
    await user.keyboard("{Enter}");
    await user.tab();
    expect(within(nav).getByRole("link", { name: "Sobre nosotros" })).toHaveFocus();
  });

  it("el panel se cierra con Escape", async () => {
    const user = userEvent.setup();
    const nav = renderNav();
    await user.click(within(nav).getByRole("button", { name: "Más" }));
    await user.keyboard("{Escape}");
    expect(within(nav).queryByRole("link", { name: "Sobre nosotros" })).not.toBeInTheDocument();
  });

  it("el panel se cierra pulsando fuera", async () => {
    const user = userEvent.setup();
    const nav = renderNav();
    await user.click(within(nav).getByRole("button", { name: "Más" }));
    await user.click(screen.getByText("Contenido de la página"));
    expect(within(nav).queryByRole("link", { name: "Sobre nosotros" })).not.toBeInTheDocument();
  });

  it("el panel se cierra al elegir un enlace", async () => {
    const user = userEvent.setup();
    const nav = renderNav();
    await user.click(within(nav).getByRole("button", { name: "Más" }));
    await user.click(within(nav).getByRole("link", { name: "Sobre nosotros" }));
    expect(within(nav).queryByRole("link", { name: "Sobre nosotros" })).not.toBeInTheDocument();
  });
});

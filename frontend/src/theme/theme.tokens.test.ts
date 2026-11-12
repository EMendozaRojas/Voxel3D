import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Contrato del tema: los nombres que usan los componentes del motor. Una
 * tienda nueva puede cambiar todos los valores, pero tiene que definirlos
 * todos; si olvida uno, este test le dice cuál.
 */
const REQUIRED_TOKENS = [
  // Colores (Tailwind crea sus clases: bg-page, text-accent…)
  "--color-page",
  "--color-text",
  "--color-text-muted",
  "--color-header",
  "--color-on-header",
  "--color-accent",
  "--color-accent-strong",
  "--color-accent-text",
  "--color-badge",
  "--color-on-badge",
  "--color-surface",
  "--color-surface-border",
  "--color-photo",
  "--color-button",
  "--color-on-button",
  "--color-button-disabled",
  "--color-on-button-disabled",
  "--color-icon-button",
  "--color-on-icon-button",
  "--color-chip",
  "--color-on-chip",
  "--color-chip-border",
  "--color-chip-active",
  "--color-on-chip-active",
  "--color-stock",
  "--color-on-stock",
  "--color-field",
  "--color-field-border",
  "--color-on-field",
  // Esquinas
  "--radius-card",
  "--radius-pill",
  // Degradados
  "--gradient-page",
  "--gradient-logo",
  "--gradient-surface",
  "--gradient-photo",
  "--gradient-button",
  "--gradient-button-disabled",
  "--gradient-icon-button",
  "--gradient-chip",
  "--gradient-chip-active",
  "--gradient-stock",
  // Tipografías
  "--font-logo",
  "--font-label",
  "--font-body",
];

const themeCss = readFileSync(join(__dirname, "theme.css"), "utf8");

/** Nombres de todas las variables definidas en el CSS (`--nombre:`). */
function definedTokens(css: string): Set<string> {
  return new Set(Array.from(css.matchAll(/(--[\w-]+)\s*:/g), (match) => match[1]));
}

describe("Contrato del tema", () => {
  const defined = definedTokens(themeCss);

  it.each(REQUIRED_TOKENS)("define %s", (token) => {
    expect(defined.has(token)).toBe(true);
  });

  it("detecta un token que falta", () => {
    const withoutAccent = themeCss.replace(/--color-accent:[^;]*;/, "");
    expect(definedTokens(withoutAccent).has("--color-accent")).toBe(false);
  });

  it("usa nombres por su papel, no por su color", () => {
    const colorWords = /--[\w-]*(copper|cobre|silver|plata|orange|naranja|steel|acero)[\w-]*\s*:/i;
    expect(themeCss).not.toMatch(colorWords);
  });
});

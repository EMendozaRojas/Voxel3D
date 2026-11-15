import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Contraste de los colores de Voxel3D (WCAG 2.1 AA).
 *
 * Lee theme.css y comprueba cada pareja de texto y fondo. Si el fondo es un
 * degradado, mide contra cada color del degradado y se queda con el peor:
 * el texto tiene que leerse en cualquier punto.
 *
 * Mínimos: 4,5:1 para texto y 3:1 para iconos (WCAG 1.4.3 y 1.4.11).
 * Cada tienda tiene sus propias parejas: al cambiar el diseño, cambia esta
 * lista.
 */
const TEXT = 4.5;
const ICON = 3;

type Pair = {
  name: string;
  /** Token del texto o del icono. */
  fg: string;
  /** Tokens del fondo: colores lisos y/o degradados. */
  bg: string[];
  min: number;
};

const PAIRS: Pair[] = [
  {
    name: "texto sobre la página",
    fg: "--color-text",
    bg: ["--color-page", "--gradient-page"],
    min: TEXT,
  },
  {
    name: "texto secundario sobre la página",
    fg: "--color-text-muted",
    bg: ["--color-page", "--gradient-page"],
    min: TEXT,
  },
  {
    name: "texto sobre la tarjeta",
    fg: "--color-text",
    bg: ["--color-surface", "--gradient-surface"],
    min: TEXT,
  },
  {
    name: "texto secundario sobre la tarjeta",
    fg: "--color-text-muted",
    bg: ["--color-surface", "--gradient-surface"],
    min: TEXT,
  },
  { name: "menú sobre la cabecera", fg: "--color-on-header", bg: ["--color-header"], min: TEXT },
  {
    name: "enlace activo sobre la cabecera",
    fg: "--color-accent-text",
    bg: ["--color-header"],
    min: TEXT,
  },
  // El menú de escritorio va dentro de un panel liso (color del buscador).
  {
    name: "menú sobre el panel de la cabecera",
    fg: "--color-on-header",
    bg: ["--color-field"],
    min: TEXT,
  },
  {
    name: "enlace activo sobre el panel de la cabecera",
    fg: "--color-accent-text",
    bg: ["--color-field"],
    min: TEXT,
  },
  { name: "contador del carrito", fg: "--color-on-badge", bg: ["--color-badge"], min: TEXT },
  {
    name: "botón principal",
    fg: "--color-on-button",
    bg: ["--color-button", "--gradient-button"],
    min: TEXT,
  },
  {
    name: "botón agotado",
    fg: "--color-on-button-disabled",
    bg: ["--color-button-disabled", "--gradient-button-disabled"],
    min: TEXT,
  },
  {
    name: "icono del botón redondo",
    fg: "--color-on-icon-button",
    bg: ["--color-icon-button", "--gradient-icon-button"],
    min: ICON,
  },
  { name: "chip", fg: "--color-on-chip", bg: ["--color-chip", "--gradient-chip"], min: TEXT },
  {
    name: "chip activo",
    fg: "--color-on-chip-active",
    bg: ["--color-chip-active", "--gradient-chip-active"],
    min: TEXT,
  },
  {
    name: "etiqueta de stock",
    fg: "--color-on-stock",
    bg: ["--color-stock", "--gradient-stock"],
    min: TEXT,
  },
  { name: "texto del buscador", fg: "--color-on-field", bg: ["--color-field"], min: TEXT },
];

const themeCss = readFileSync(join(__dirname, "theme.css"), "utf8");

/** Colores hexadecimales de un token: uno si es liso, varios si es degradado. */
function colorsOf(css: string, token: string): string[] {
  const match = css.match(new RegExp(`${token}\\s*:\\s*([^;]+);`));
  if (!match) throw new Error(`theme.css no define ${token}`);
  const hexes = match[1].match(/#[0-9a-f]{6}\b/gi);
  if (!hexes) throw new Error(`${token} no tiene colores en formato #rrggbb`);
  return hexes;
}

/** Luminancia relativa de un color (fórmula de WCAG). */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** El peor contraste de la pareja, contra todos los colores del fondo. */
function worstContrast(css: string, pair: Pair): number {
  const [fg] = colorsOf(css, pair.fg);
  const backgrounds = pair.bg.flatMap((token) => colorsOf(css, token));
  return Math.min(...backgrounds.map((bg) => contrast(fg, bg)));
}

describe("Contraste del tema", () => {
  it("calcula bien el contraste (blanco sobre negro = 21:1)", () => {
    expect(contrast("#ffffff", "#000000")).toBeCloseTo(21, 5);
    expect(contrast("#777777", "#ffffff")).toBeCloseTo(4.48, 2);
  });

  it.each(PAIRS)("$name llega al mínimo", (pair) => {
    expect(worstContrast(themeCss, pair)).toBeGreaterThanOrEqual(pair.min);
  });

  it("detecta un color que empeora (el texto secundario anterior)", () => {
    const worse = themeCss.replace(/--color-text-muted:[^;]*;/, "--color-text-muted: #c9cdd2;");
    const pair = PAIRS.find((p) => p.name === "texto secundario sobre la tarjeta")!;
    expect(worstContrast(worse, pair)).toBeLessThan(TEXT);
  });
});

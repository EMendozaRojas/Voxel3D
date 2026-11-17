import { Arimo, Rajdhani, Russo_One } from "next/font/google";

/**
 * Fuentes de la tienda. Next.js las descarga al construir la web y las sirve
 * desde la propia tienda: el navegador de quien visita no habla con Google.
 *
 * Cada fuente deja su nombre en una variable CSS (`--font-store-*`) y
 * `theme.css` la conecta con los nombres neutros que usan los componentes
 * (`font-logo`, `font-label`, `font-body`). Otra tienda cambia aquí las
 * fuentes sin tocar ningún componente.
 */

// Logo.
const logo = Russo_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-store-logo",
});

// Menú, filtros, botones y etiquetas.
const label = Rajdhani({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-store-label",
});

// Nombres de producto, precios y textos.
const body = Arimo({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-store-body",
});

/** Clases que declaran las tres variables; van en la etiqueta `<html>`. */
export const fontVariables: string = [logo.variable, label.variable, body.variable].join(" ");

import type { Metadata } from "next";

import { NotFoundView } from "@/theme/pages/NotFoundView";

export const metadata: Metadata = { title: "Página no encontrada" };

/**
 * Motor: se muestra cuando una dirección no existe (o una página llama a
 * `notFound()`). Va dentro de la disposición de la tienda, así que lleva
 * cabecera, pie y barra del móvil; el aspecto lo pone la carrocería.
 */
export default function NotFound() {
  return <NotFoundView homeHref="/" />;
}

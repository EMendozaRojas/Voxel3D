/**
 * Logo de la tienda (carrocería).
 *
 * - `text`: escribe el nombre de la tienda (STORE_NAME) con la fuente y el
 *   degradado del logo de theme.css. Es lo que usa Voxel3D.
 * - `image`: usa una imagen de `public/`. `width` y `height` son el tamaño
 *   real del archivo (Next.js los usa para reservar el hueco); el tamaño en
 *   pantalla lo pone el CSS.
 */
export type Brand =
  { type: "text" } | { type: "image"; src: string; alt: string; width: number; height: number };

export const brand: Brand = { type: "text" };

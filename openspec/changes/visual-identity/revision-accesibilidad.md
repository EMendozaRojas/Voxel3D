# Revisión de accesibilidad (tarea 4.3)

Fecha: 2026-11-15. Páginas: portada (`/`), `/muestrario` y la página 404
(`/no-existe`), a 375 px (móvil) y 1100 px (escritorio). Este texto se copia
en el PR de `visual-identity`.

## Cómo se midió

- **Tamaño de los objetivos táctiles:** un script en el navegador recorre
  todos los enlaces, botones y campos visibles y avisa de los que miden menos
  de 44 × 44 px.
- **Foco visible:** el mismo script da el foco a cada elemento y comprueba
  que lleva un contorno sólido de al menos 2 px. Además, se navegó con Tab y
  se miró en pantalla.
- **Teclado y `Escape`:** tests con `user-event` (paneles "Más" de la barra
  inferior y de las categorías).
- **Desbordamiento:** la página no se desplaza en horizontal a 320, 375 y
  414 px.

## Encontrado y corregido

| Problema | Corrección |
|---|---|
| Logo en el móvil: 121 × 26 px | El enlace mide 44 px de alto |
| Menú de escritorio y tableta: 34 px de alto | Enlaces de 44 px; el subrayado de la página activa pasa a `text-decoration` |
| Buscador: zona de escritura de 24 px | El campo ocupa toda la píldora (50 px) |
| Foco: contorno del navegador de 1 px, poco visible sobre fondo oscuro | Anillo de 2 px en `--color-accent-text` para toda la tienda; en el buscador, alrededor de la píldora |
| Barra del móvil: el panel "Más" iba antes del botón en el código, así que Tab no llegaba a sus enlaces | El panel va después del botón; test nuevo "Tab llega a sus enlaces" |

## Resultado final

- 0 elementos de menos de 44 px en las cinco combinaciones de página y ancho.
- Todos los elementos que pueden recibir el foco muestran el anillo. Los
  botones "Agotado" no lo reciben porque están desactivados (es lo correcto).
- `Escape` y pulsar fuera cierran los dos paneles; los botones anuncian si su
  panel está abierto (`aria-expanded`).
- Enlace "Saltar al contenido" al principio de cada página.
- Contraste: `theme.contrast.test.ts` (16 parejas, todas ≥ 4,5:1; iconos ≥ 3:1).

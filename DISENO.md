# Diseño de Voxel3D

Identidad visual aprobada el 2026-10-20. Es la **opción B ("metálica")** de las
maquetas, con el logo "modelo 2" sin cubo. Este documento es la fuente de
verdad para construir las pantallas: si algo del diseño cambia, se cambia aquí
primero.

> Las maquetas se hicieron en un lienzo privado de Claude, así que no se
> enlazan desde el repositorio público. Para el README se harán capturas de
> la aplicación real.

## Idea del diseño

Un taller industrial: **acero oscuro perforado, tornillos y acentos de cobre**.
Encaja con la impresión 3D y es reconocible. Los productos son los
protagonistas: las fotos van sobre fondo blanco dentro de un marco metálico.

## Colores

| Uso | Valor | Token en `theme.css` |
|---|---|---|
| Fondo de página | degradado `#3a3d41` → `#232528` → `#2d3034` con líneas verticales finas (metal cepillado) | `--gradient-page` (liso: `--color-page`) |
| Cabecera y pie | fondo `#1b1c1e` con puntos `#08080a` (acero perforado, patrón de 7 px; 6 px en móvil) | `--color-header`, adorno `.decor-perforated` |
| Línea bajo la cabecera y sobre el pie | cobre `#b8651d` (4 px; 3 px en móvil) | `--color-accent-strong` |
| Texto principal | `#f1f1f1` | `--color-text` |
| Texto secundario | `#d4d7db` (material, pie y menús) | `--color-text-muted`, `--color-on-header` |
| Acento de texto (enlace activo) | cobre claro `#e0904f` | `--color-accent-text` |
| Acento de línea | `#d9772f` (subrayado del menú activo) | `--color-accent` |
| Barras laterales de la tarjeta | `#cf6a24` | `--decor-bar`, adorno `.decor-bars` |
| Marco de la tarjeta | degradado `#5a5e64` → `#2e3135` → `#212326`, con remaches `#c1c6cc` / `#4b4f55` en las esquinas | `--gradient-surface`, `--color-surface-border`, adorno `.decor-rivets` |
| Foto del producto | fondo blanco `#ffffff` → `#ececea` | `--gradient-photo` |
| Etiqueta de stock | degradado `#b4571f` → `#963f14`, texto blanco | `--gradient-stock`, `--color-on-stock` |
| Filtro / categoría activa | degradado `#e8924c` → `#d2711f`, texto `#17181a` | `--gradient-chip-active`, `--color-on-chip-active` |
| Filtro / categoría inactiva | degradado `#3b3e42` → `#26282b`, texto `#f1f1f1`, borde `#55595f` | `--gradient-chip`, `--color-on-chip`, `--color-chip-border` |
| Botón principal (plata) | degradado `#d6d9dd` → `#a5a9ae` → `#8a8e93`, texto `#17181a` | `--gradient-button`, `--color-on-button` |
| Botón agotado | degradado `#4a4d52` → `#34373b`, texto `#cfd3d8` | `--gradient-button-disabled`, `--color-on-button-disabled` |
| Buscador y panel del menú | fondo `#111213`, borde `#50545a`, sombra interior | `--color-field`, `--color-field-border` |
| Botones redondos (cuenta, carrito) | plata `#e0e3e7` → `#8a8e94`, icono `#1b1c1e` | `--gradient-icon-button`, `--color-on-icon-button` |
| Contador del carrito | fondo `#a9531e`, texto blanco | `--color-badge`, `--color-on-badge` |
| Esquinas | tarjeta 16 px; chips, buscador y botones en píldora | `--radius-card`, `--radius-pill` |

Los nombres de los tokens dicen **para qué sirve** el color (`accent`, `surface`),
nunca **cuál es** (`cobre`): así otra tienda cambia el valor sin que el nombre
mienta. Cada degradado tiene un color liso de respaldo con el mismo papel. Lo
comprueba `frontend/src/theme/theme.tokens.test.ts`.

> **Contraste comprobado** por `frontend/src/theme/theme.contrast.test.ts`
> (16 parejas de texto y fondo): 4,5:1 para texto y 3:1 para iconos, contra el punto más desfavorable de cada
> degradado. Único ajuste (2026-11-15): el texto secundario pasó de `#c9cdd2`
> a `#d4d7db`, porque sobre la parte clara del marco de la tarjeta (`#5a5e64`)
> daba 4,08:1; ahora da 4,52:1. Se eligió aclarar el texto en vez de
> oscurecer el marco para no cambiar el metal de las tarjetas.

## Tipografías

| Uso | Fuente | Detalle |
|---|---|---|
| Logo | **Russo One** | `Voxel3D`, mayúsculas, 44 px en escritorio y 26 px en móvil, degradado cobre `#f0954f` → `#a8521a`, brillo naranja y sombra suave. **Sin cubo.** |
| Menú, filtros, botones, etiquetas, pie | **Rajdhani** 500 / 600 / 700 | mayúsculas, separación de letras de 1 px |
| Nombres de producto, precios, textos | **Arimo** 400 / 700 | equivalente a Arial. Nombre 18 px negrita, precio 20 px negrita |

Todas son fuentes gratuitas de Google Fonts.

## Componentes

- **Cabecera:** logo a la izquierda y, a la derecha, un panel con borde cobre:
  *Inicio · Productos · Sobre nosotros*, cuenta y carrito (botones redondos
  de plata de 44 px con contador). El panel tiene **fondo liso** `#111213`
  (como el buscador), sin los puntos del acero, para que el menú se lea mejor.
- **Adornos** (en `theme.css`, solo con CSS): `.decor-perforated` (acero
  perforado), `.decor-line-bottom` / `.decor-line-top` (línea cobre),
  `.decor-rivets` (remaches sobre el marco de la tarjeta) y `.decor-bars`
  (barras de cobre). El metal cepillado va directamente en el fondo de la
  página.
- **Buscador:** píldora oscura de 52 px de alto con un **cubo voxel** naranja
  a la derecha (el único cubo del diseño). Texto: "Buscar productos 3D de alta
  tecnología…".
- **Tarjeta de producto:** marco metálico con remaches y barras de cobre,
  foto sobre blanco, **etiqueta de stock** en la esquina de la foto ("Quedan
  3", "En stock", "Agotado"), nombre, precio y material con acabado
  (`PLA · Negro`), y botón plata **"Añadir al carrito"**. Si no hay stock, el
  botón pasa a "Agotado" y se desactiva.
- **Rejilla de productos:** columnas de al menos 250 px, separación de 28 px,
  esquinas de la tarjeta de 16 px.
- **Pie:** igual que la cabecera. Incluye "Modo demostración: no se cobra
  dinero real."

## Móvil

- **Cabecera** de 64 px: logo a la izquierda y botón de carrito con contador a
  la derecha.
- **Buscador** de 48 px bajo la cabecera.
- **Categorías en chips:** se muestran **tres** (*Todos · Hogar · Animales*)
  y un botón **Más** que abre un panel con el resto (*Geek*, *Lámparas*…). Si
  se elige una categoría del panel, el botón **Más** pasa a llevar su nombre y
  queda marcado. El panel se cierra pulsando fuera de él. Funciona igual con
  más o menos categorías.
- **Rejilla de dos columnas.** El botón de cada tarjeta dice "Añadir".
- **Barra inferior** de 64 px con el mismo estilo de acero: *Inicio ·
  Productos · Cuenta · Más*. **Más** no cambia de página: abre un **panel desde
  abajo** con el resto de enlaces (*Sobre nosotros*…), como en las apps. Se
  cierra con `Escape`, pulsando fuera o eligiendo un enlace (decidido el
  2026-11-15).

## Contenido

- Todo el texto en **español** y los precios en euros: `14,90 €`.
- Etiquetas de stock: **En stock**, **Quedan N** (el umbral se decide al
  implementar el inventario) y **Agotado**.
- Las **fotos** serán de las piezas reales o de diseños propios, siempre con el
  mismo fondo y la misma luz. Las maquetas usan cubos como marcador de
  posición. No se usan marcas registradas.
- Estado de página activa: `aria-current="page"` y color cobre claro.

## Accesibilidad

- Objetivos táctiles de **al menos 44 px**.
- Contraste de texto de al menos **4,5:1** y de iconos de al menos **3:1**,
  comprobado por un test (ver [Colores](#colores)).
- Anillo de foco visible (2 px, `--color-accent-text`) en todo lo que se
  puede usar con el teclado, y enlace "Saltar al contenido" al principio.
- Revisión completa del 2026-11-15 en
  `openspec/changes/visual-identity/revision-accesibilidad.md`.
- Iconos sin texto llevan `aria-label`; el buscador lleva su `<label>`.
- Se usan elementos reales (`<button>`, `<a>`, `<input>`), nunca un `<div>`
  con `onClick`.

## Pendiente de diseño

- Pantallas todavía sin maquetar: detalle de producto, carrito, checkout,
  cuenta del cliente y panel de administración. Se diseñan siguiendo este
  documento, con su propio change.

Resuelto en `visual-identity` (2026-11-16):

- **Valores pasados a tokens** de Tailwind en `frontend/src/theme/theme.css`
  (tabla de [Colores](#colores)).
- **Logo en imagen:** el motor ya lo permite (`frontend/src/theme/brand.ts`,
  tipo `image`). Voxel3D sigue con el logo de texto; si algún día se dibuja
  uno en imagen, basta con cambiar ese archivo.
- **Dónde vive cada cosa:** todo el aspecto está en `frontend/src/theme/`
  (la carrocería). Cómo cambiarlo, en `docs/CAMBIAR_EL_DISENO.md`.

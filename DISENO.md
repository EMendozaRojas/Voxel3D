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

| Uso | Valor |
|---|---|
| Fondo de página | degradado `#3a3d41` → `#232528` → `#2d3034` con líneas verticales finas (metal cepillado) |
| Cabecera y pie | fondo `#1b1c1e` con puntos `#08080a` (acero perforado, patrón de 7 px; 6 px en móvil) |
| Línea bajo la cabecera y sobre el pie | cobre `#b8651d` (4 px; 3 px en móvil) |
| Texto principal | `#f1f1f1` |
| Texto secundario | `#c9cdd2` (material), `#d4d7db` (pie y menús) |
| Acento de texto (enlace activo) | cobre claro `#e0904f` |
| Acento de línea | `#d9772f` (subrayado del menú activo) |
| Barras laterales de la tarjeta | `#cf6a24` |
| Marco de la tarjeta | degradado `#5a5e64` → `#2e3135` → `#212326`, con remaches `#c1c6cc` / `#4b4f55` en las esquinas |
| Foto del producto | fondo blanco `#ffffff` → `#ececea` |
| Etiqueta de stock | degradado `#b4571f` → `#963f14`, texto blanco |
| Filtro / categoría activa | degradado `#e8924c` → `#d2711f`, texto `#17181a` |
| Filtro / categoría inactiva | degradado `#3b3e42` → `#26282b`, texto `#f1f1f1`, borde `#55595f` |
| Botón principal (plata) | degradado `#d6d9dd` → `#a5a9ae` → `#8a8e93`, texto `#17181a` |
| Botón agotado | degradado `#4a4d52` → `#34373b`, texto `#cfd3d8` |
| Buscador | fondo `#111213`, borde `#50545a`, sombra interior |
| Botones redondos (cuenta, carrito) | plata `#e0e3e7` → `#8a8e94`, icono `#1b1c1e` |
| Contador del carrito | fondo `#a9531e`, texto blanco |

> Los contrastes se estimaron a mano para las parejas de texto principales.
> **Pendiente:** comprobarlos con una herramienta de contraste antes de
> definir los tokens finales (objetivo: 4,5:1 en texto normal).

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
  de plata de 44 px con contador).
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
  Productos · Cuenta · Más*.

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
- Contraste de texto de al menos **4,5:1** (a verificar, ver arriba).
- Iconos sin texto llevan `aria-label`; el buscador lleva su `<label>`.
- Se usan elementos reales (`<button>`, `<a>`, `<input>`), nunca un `<div>`
  con `onClick`.

## Pendiente de diseño

- Logo en imagen, más fiel al aspecto metálico, en el change `visual-identity`.
- Pantallas todavía sin maquetar: detalle de producto, carrito, checkout,
  cuenta del cliente y panel de administración. Se diseñan siguiendo este
  documento, con su propio change.
- Mover los valores de esta página a tokens de Tailwind.

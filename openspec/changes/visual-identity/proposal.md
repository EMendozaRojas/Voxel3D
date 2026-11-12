# Proposal

## Why

El frontend de Voxel3D hoy es una portada sin estilo que solo dice si el
servidor está conectado. La identidad visual está aprobada en `DISENO.md`, pero
todavía es solo papel. Antes de construir el catálogo, el carrito o el login
hace falta el **juego de piezas** con el que se montan todas las pantallas:
colores, fuentes, logo, cabecera, pie y componentes base.

Además, Voxel3D es la primera tienda sobre un motor reutilizable (Chasis). Si
el aspecto metálico se escribe dentro de los componentes, Sakuribella tendría
que reescribirlos. Este change separa **qué se ve** (el tema de cada tienda) de
**qué hace** cada pieza (el motor), para que otra tienda cambie su aspecto
editando solo su tema.

## What Changes

Este change **incluye pantalla (UI)**; no toca el backend.

- **Tema de la tienda en una sola carpeta** (`frontend/src/theme/`): colores,
  tipografías, logo y **adornos** (texturas de acero, remaches, barras de
  cobre). Los componentes solo usan nombres neutros (`accent`, `surface`,
  `on-accent`…), nunca `cobre` ni `Voxel3D`. Cada adorno se puede apagar o
  cambiar desde el tema (decisión 2B de la usuaria).
- **Logo de texto** con la fuente y el degradado del tema (Russo One y cobre en
  Voxel3D), con la opción de usar una imagen en su lugar si una tienda la tiene
  (decisión 3A). El texto del logo es el nombre de la tienda
  (`NEXT_PUBLIC_STORE_NAME`, que sale del mismo `STORE_NAME` del backend).
- **Estructura común de todas las páginas**: cabecera (logo, menú, cuenta y
  carrito con contador), pie con el aviso "Modo demostración: no se cobra dinero
  real", y en el móvil cabecera reducida y barra inferior.
- **Piezas sueltas**: botón (principal, agotado), chips de categoría (con el
  botón "Más" en el móvil), buscador con el cubo voxel, tarjeta de producto y
  etiqueta de stock ("En stock", "Quedan N", "Agotado").
- **Página `/muestrario`**, solo en desarrollo, que enseña cada pieza con datos
  de ejemplo (decisión 1A). La portada sigue mostrando el estado del servidor,
  ya con el nuevo aspecto.
- **Contrastes comprobados por un test**: las parejas de texto y fondo del tema
  cumplen al menos 4,5:1. Los valores ajustados se apuntan en `DISENO.md`.
- `DISENO.md`, `CLAUDE.md` y el README al día (sale de pendientes "Logo en
  imagen" y "mover los valores a tokens").

## Capabilities

### New Capabilities

- `store-theme`: el tema de cada tienda (tokens neutros, fuentes, logo,
  adornos que se pueden apagar) y la regla de que el motor no conoce la tienda.
- `storefront-layout`: la estructura común de las páginas (cabecera, pie,
  barra inferior móvil, aviso de demostración) y su accesibilidad.
- `ui-components`: las piezas base (botón, chips, buscador, tarjeta, etiqueta
  de stock) y el muestrario.

### Modified Capabilities

- `service-health`: la portada usa el nuevo aspecto; sus escenarios no cambian.
  (No requiere delta.)

## Impact

- Código: `frontend/src/theme/`, `frontend/src/components/`, `frontend/src/app/`
  (`layout.tsx`, `page.tsx`, `muestrario/`).
- Configuración: nueva variable `NEXT_PUBLIC_STORE_NAME` en `.env.example`,
  `docker-compose.yml`, `frontend/Dockerfile` y la CI.
- Documentación: `DISENO.md`, `CLAUDE.md`, `README.md`.
- Dependencias: ninguna nueva; las fuentes llegan con `next/font/google` (ya
  incluido en Next.js) y se sirven desde la propia web, sin pedirlas a Google
  en cada visita.

## Out of scope

- **Datos reales**: los chips, tarjetas y contadores reciben datos de ejemplo.
  Las categorías y productos llegan en `catalog-and-products`; el contador del
  carrito, en `cart`.
- **Páginas de destino** de los enlaces del menú (Productos, Sobre nosotros,
  Cuenta, Carrito): los enlaces existen, pero sus páginas llegan en su change.
- **Que el buscador busque**: aquí solo es la pieza visual con su etiqueta.
- **Pantallas sin maquetar**: detalle de producto, carrito, checkout, cuenta y
  panel de administración.
- **El tema neutro de Chasis**: se crea al separar el padre, al final del MVP.
  Aquí solo se deja preparado (un tema = una carpeta).
- **Logo dibujado en imagen** para Voxel3D: queda la opción en el tema, pero no
  se diseña ninguno.
- **Tests de extremo a extremo con Playwright** (llegan con el catálogo) y
  modo oscuro/claro alternativo.

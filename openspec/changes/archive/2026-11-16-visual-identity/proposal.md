# Proposal

## Why

El frontend de Voxel3D hoy es una portada sin estilo que solo dice si el
servidor está conectado. La identidad visual está aprobada en `DISENO.md`, pero
todavía es solo papel. Antes de construir el catálogo, el carrito o el login
hace falta el **juego de piezas** con el que se montan todas las pantallas:
colores, fuentes, logo, cabecera, pie y componentes base.

Además, Voxel3D es la primera tienda sobre un motor reutilizable (Chasis). La
idea de la autora es que **el esqueleto ahorre la funcionalidad y el diseño de
cada tienda sea libre**: no solo los colores, también la forma y la disposición
de las piezas. Por eso este change separa, en cada pieza, **lo que hace** (la
lógica, en el motor) de **cómo se ve** (la carrocería, en la carpeta de cada
tienda). Sakuribella podrá rehacer su tarjeta o su cabecera sin tocar el motor,
y las mejoras del motor le llegarán sin pisar su diseño.

## What Changes

Este change **incluye pantalla (UI)**; no toca el backend.

- **Chasis y carrocería separados** (decisión A de la usuaria, 2026-11-12):
  - **Motor (chasis):** la lógica de cada pieza en funciones y *hooks* con sus
    tests (texto del stock, formato del precio, abrir y cerrar paneles,
    página activa del menú…), y las páginas, que obtienen los datos y los pasan
    a la vista.
  - **Carrocería (`frontend/src/theme/`):** todo lo que se ve. Colores,
    tipografías, logo, adornos y **también los componentes visuales** y la
    disposición de la página. Cada tienda la cambia o la rehace libremente.
  - **Contrato con tipos de TypeScript:** el motor define qué datos recibe cada
    pieza; si una carrocería olvida uno, la comprobación de tipos falla.
- **Carrocería de Voxel3D**, la metálica de `DISENO.md`:
  - Logo de texto con Russo One y degradado cobre, con la opción de usar una
    imagen (decisión 3A).
  - Estructura de las páginas: cabecera (logo, menú, cuenta y carrito con
    contador), pie con el aviso "Modo demostración: no se cobra dinero real" y,
    en el móvil, cabecera reducida y barra inferior.
  - Piezas: botón, chips de categoría con "Más" en el móvil, buscador con el
    cubo voxel, tarjeta de producto y etiqueta de stock.
  - Adornos dibujados con CSS: acero perforado, metal cepillado, remaches y
    barras de cobre.
- **Página `/muestrario`**, solo en desarrollo, que enseña cada pieza con datos
  de ejemplo (decisión 1A). La portada sigue mostrando el estado del servidor,
  ya con el nuevo aspecto.
- **Contrastes comprobados por un test** (al menos 4,5:1); los valores
  ajustados se apuntan en `DISENO.md`.
- **Prueba de libertad con otra IA:** un `AGENTS.md` (el archivo que leen casi
  todas las IAs de programación) y una guía breve para cambiar el diseño. Con
  ellos, la autora pide a otra IA el aspecto de Sakuribella en una rama de
  prueba que no se une, y lo que se atasque se corrige en el motor o en la
  documentación.
- `DISENO.md`, `CLAUDE.md` y el README al día.

## Capabilities

### New Capabilities

- `store-theme`: la separación entre motor y carrocería, el contrato de tipos,
  el logo y el contraste.
- `storefront-layout`: la estructura común de las páginas de Voxel3D
  (cabecera, pie, barra inferior móvil, aviso de demostración) y su
  accesibilidad.
- `ui-components`: las piezas base (botón, chips, buscador, tarjeta, etiqueta
  de stock), con su lógica en el motor, y el muestrario.

### Modified Capabilities

- `service-health`: la portada usa el nuevo aspecto; sus escenarios no cambian.
  (No requiere delta.)

## Impact

- Código del motor: `frontend/src/lib/`, `frontend/src/hooks/`,
  `frontend/src/config/`, `frontend/src/app/` (`layout.tsx`, `page.tsx`,
  `muestrario/`) y el contrato `frontend/src/lib/theme-contract.ts`.
- Carrocería: `frontend/src/theme/` (CSS, fuentes, marca, `layout/` y `ui/`).
- Configuración: nueva variable `NEXT_PUBLIC_STORE_NAME` (sale de `STORE_NAME`)
  en `docker-compose.yml`, `frontend/Dockerfile` y la CI.
- Documentación: `AGENTS.md` (nuevo), guía para cambiar el diseño, `DISENO.md`,
  `CLAUDE.md` y `README.md`.
- Dependencias: ninguna nueva; las fuentes llegan con `next/font/google` (ya
  incluido en Next.js) y se sirven desde la propia web.

## Out of scope

- **Datos reales**: los chips, tarjetas y contadores reciben datos de ejemplo.
  Las categorías y productos llegan en `catalog-and-products`; el contador del
  carrito, en `cart`.
- **Páginas de destino** de los enlaces del menú (Productos, Sobre nosotros,
  Cuenta, Carrito): los enlaces existen, pero sus páginas llegan en su change.
- **Que el buscador busque**: aquí solo es la pieza visual con su etiqueta.
- **Pantallas sin maquetar**: detalle de producto, carrito, checkout, cuenta y
  panel de administración.
- **Crear Chasis y la carrocería neutra de ejemplo**: se hace al separar el
  padre, al final del MVP. La carrocería de Sakuribella de la prueba no se une
  a ninguna rama.
- **Cambiar el diseño sin programar** (desde el panel, como en WordPress): el
  diseño se cambia con código; desde el panel se gestionará el catálogo.
- **Logo dibujado en imagen** para Voxel3D: queda la opción, pero no se diseña.
- **Tests de extremo a extremo con Playwright** (llegan con el catálogo) y
  modo oscuro/claro alternativo.

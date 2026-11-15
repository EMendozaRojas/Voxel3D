# AGENTS.md: instrucciones para asistentes de IA

Este repositorio es una **tienda online** construida sobre un motor
reutilizable. Si te piden cambiar el **aspecto** de la tienda (colores,
tipografías, logo, forma de las piezas, disposición) o crear el aspecto de
otra tienda, lee esto primero. La guía paso a paso está en
[`docs/CAMBIAR_EL_DISENO.md`](docs/CAMBIAR_EL_DISENO.md).

Todo el proyecto está en **español** (código comentado, textos de la web y
mensajes de commit).

## Chasis y carrocería

- **Chasis (motor):** la lógica. Qué pasa, no cómo se ve. **No lo cambies para
  cambiar el diseño.**
- **Carrocería:** todo lo que se ve. Cada tienda la cambia con total libertad,
  también la forma de las piezas y dónde va cada una.

| Puedes cambiar (es de la tienda) | No cambies (es del motor) |
|---|---|
| `frontend/src/theme/` (todo) | `frontend/src/app/` |
| `frontend/src/config/` (todo) | `frontend/src/lib/` (incluido `theme-contract.ts`) |
| `frontend/public/` (imágenes, logo) | `frontend/src/hooks/` |
| `.env` (`STORE_NAME`, el nombre de la tienda) | `frontend/src/components/` y `frontend/src/features/` |
| `DISENO.md` (el diseño de la tienda, por escrito) | `backend/`, `docker-compose.yml`, `.github/`, `openspec/` |

Si para conseguir un diseño crees que hace falta tocar el motor, **para y
explícalo** en vez de cambiarlo: es justo lo que esta plantilla quiere
descubrir.

## El contrato: lo que la carrocería tiene que ofrecer

El motor importa estas piezas por su ruta y su nombre. Puedes rehacerlas por
completo, pero **deben existir con ese nombre, en ese archivo, y aceptar las
props** del tipo indicado de `frontend/src/lib/theme-contract.ts`. Si no,
`tsc` falla.

| Archivo en `frontend/src/theme/` | Exporta | Props (en `theme-contract.ts`) | Lo usa |
|---|---|---|---|
| `theme.css` | estilos (lo importa `app/globals.css`) | — | toda la web |
| `fonts.ts` | `fontVariables` (clases de las fuentes, separadas por espacios) | — | `app/layout.tsx` |
| `layout/StoreLayout.tsx` | `StoreLayout` | `StoreLayoutProps` | todas las páginas |
| `pages/HomeView.tsx` | `HomeView` | `HomeViewProps` | portada |
| `pages/NotFoundView.tsx` | `NotFoundView` | `NotFoundViewProps` | página 404 |
| `ui/Button.tsx` | `Button` | atributos de `<button>` | muestrario |
| `ui/StockBadge.tsx` | `StockBadge` | `StockBadgeProps` | muestrario |
| `ui/ProductCard.tsx` | `ProductCard` | `ProductCardProps` | muestrario |
| `ui/CategoryChips.tsx` | `CategoryChips` | `CategoryChipsProps` | muestrario |
| `ui/SearchBox.tsx` | `SearchBox` | `SearchBoxProps` | muestrario |

Lo demás de `theme/` (cabecera, pie, barra del móvil, logo, adornos…) es
interno de la carrocería: puedes renombrarlo, juntarlo o borrarlo.

## Lógica que ya existe: úsala, no la copies

| Necesitas… | Usa (motor) |
|---|---|
| Saber si un enlace es la página actual | `isActivePath` en `lib/navigation.ts` |
| Escribir un precio (`1490` → `14,90 €`) | `formatPrice` en `lib/format.ts` |
| El texto del stock (Agotado / Quedan N / En stock) | `getStockStatus` en `lib/stock.ts` |
| Abrir y cerrar un panel (con `Escape` y pulsando fuera) | `useDisclosure` en `hooks/useDisclosure.ts` |
| Chips de categoría con botón "Más" | `useCategoryChips` en `hooks/useCategoryChips.ts` |

## Reglas que se comprueban solas

- **El motor no conoce ninguna tienda.** `lib/engine-neutral.test.ts` falla si
  aparece un color hexadecimal, "Voxel3D" o "cobre" fuera de `theme/` y
  `config/`.
- **Accesibilidad mínima:** contraste de texto ≥ 4,5:1 (iconos ≥ 3:1),
  objetivos táctiles de al menos 44 × 44 px, foco del teclado visible, botones
  de solo icono con nombre (`aria-label`), elementos reales (`<header>`,
  `<nav>`, `<main>`, `<footer>`, `<button>`…).
- **El aviso "Modo demostración"** (`DEMO_NOTICE`) tiene que verse en todas
  las páginas: los pagos son siempre de prueba.
- **Los tests de `theme/` son de la tienda.** Si rehaces una pieza, rehaz
  también su test. Los tests del resto de carpetas (el motor) tienen que
  seguir pasando sin tocarlos.

## Cómo se arranca y se comprueba

En el ordenador no hay Node.js: todo corre en Docker.

```bash
cp .env.example .env           # solo la primera vez
docker compose up -d --build   # web en http://localhost:3000
```

- **Ver todas las piezas:** http://localhost:3000/muestrario (solo en
  desarrollo; los datos de ejemplo están en `frontend/src/config/showcase.ts`).
- **Comprobar el trabajo** (con el proyecto arrancado):

```bash
docker compose exec frontend npx tsc --noEmit
docker compose exec frontend npm run test:coverage
docker compose exec frontend npm run lint
docker compose exec frontend npm run format       # o format:check para solo mirar
```

**Next.js 16** tiene cambios importantes: antes de escribir código de Next,
lee la guía en `frontend/node_modules/next/dist/docs/` (lo explica
`frontend/AGENTS.md`). Tailwind CSS es la versión 4: los colores se definen
con `@theme` en `theme.css`.

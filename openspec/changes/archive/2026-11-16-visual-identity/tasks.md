# Tasks

Cada pieza se hace en dos partes: primero su **lógica en el motor** (con sus
tests) y después su **vista en la carrocería** (`src/theme/`, con tests de
vista). Ver `design.md`, decisión 1.

## 1. Carrocería base y reglas del motor

- [x] 1.1 Añadir `NEXT_PUBLIC_STORE_NAME` (en `.env.example`, en `docker-compose.yml` con el valor de `STORE_NAME`, como `ARG` en `frontend/Dockerfile` y en la CI) y usarlo en el título de la pestaña; verificar con un test que el título lleva el nombre de la tienda y que `docker build --target prod` termina sin errores
- [x] 1.2 Crear `src/theme/fonts.ts` (Russo One, Rajdhani y Arimo con `next/font/google`, cada una con su variable CSS) y aplicarlas en `layout.tsx`, tras leer la guía de fuentes de `node_modules/next/dist/docs/`; verificar que `npm run build` termina sin errores y que el HTML de la portada no pide nada a `fonts.googleapis.com`
- [x] 1.3 Crear `src/theme/theme.css` con los tokens neutros de color, degradados, radios y tamaños de `DISENO.md` (`@theme` de Tailwind) e importarlo desde `globals.css`; verificar que una clase como `bg-surface` o `text-accent` aplica el color del tema
- [x] 1.4 Escribir `src/theme/theme.contrast.test.ts` que lee `theme.css` y comprueba el contraste de cada pareja de texto y fondo de Voxel3D (≥ 4,5:1, peor extremo en los degradados); proponer a la usuaria el ajuste mínimo de los colores que no cumplan y apuntarlo en `DISENO.md`; verificar que el test pasa y que falla si se empeora un color a propósito (revertir después)
- [x] 1.5 Dibujar con CSS en `theme.css` los adornos de Voxel3D (acero perforado, metal cepillado, línea de acento, remaches y barras laterales) como clases propias de la carrocería; verificar en el navegador que se ven como en `DISENO.md`
- [x] 1.6 Crear `src/lib/theme-contract.ts` (tipos de los datos de cada pieza, se irán completando en los bloques 2 y 3) y el test del motor neutro: ningún archivo de `src/` fuera de `theme/` y `config/` contiene colores hexadecimales, "Voxel3D" ni "cobre"; verificar que el test pasa y que falla si se añade un color a mano en el motor (revertir después)

## 2. Estructura común de las páginas

- [x] 2.1 Crear `src/theme/brand.ts` y `theme/layout/Logo.tsx` (texto con degradado o imagen, enlace a `/`); verificar con tests los dos tipos de logo (texto con el nombre de la tienda e imagen con su `alt`) y que ambos enlazan a la portada
- [x] 2.2 Motor: `src/config/navigation.ts` (enlaces del menú y de la barra inferior) y `lib/navigation.ts` (`isActivePath`); verificar con tests que `/` solo está activa en la portada y que `/productos/macetas` activa "Productos"
- [x] 2.3 Carrocería: `theme/layout/SiteHeader.tsx` (logo, menú con `aria-current`, botones de cuenta y carrito con contador y nombre accesible), con sus datos tipados en el contrato; verificar con tests la página activa, el contador con 3 unidades, el carrito vacío sin contador y los nombres "Mi cuenta" y "Carrito"
- [x] 2.4 Motor: `hooks/useDisclosure.ts` (abrir y cerrar un panel, con `Escape` y pulsando fuera; adelantado de la 3.4 porque «Más» abre un panel) y `moreLinks` en `config/navigation.ts`. Carrocería: `SiteFooter` con el aviso "Modo demostración: no se cobra dinero real." y `BottomNav` para el móvil (Inicio, Productos y Cuenta como enlaces, y un botón Más que abre un panel desde abajo con el resto de enlaces; oculta en escritorio); verificar con tests del *hook* cada regla, que el aviso aparece, que la barra marca la página actual con `aria-current="page"` y que el panel de Más se abre, se cierra con `Escape` y pulsando fuera, y anuncia si está abierto (`aria-expanded`)
- [x] 2.5 Carrocería: `theme/layout/StoreLayout.tsx` decide la disposición (cabecera, `<main>`, pie y barra inferior), y `app/layout.tsx` (motor) solo pone `<html>`, fuentes y Providers y llama a `StoreLayout`; dar a la portada (estado del servidor) el nuevo aspecto; verificar que los tests de `service-health` siguen pasando y, en el navegador, que escritorio y móvil (375 px) se ven como en `DISENO.md`

## 3. Piezas sueltas

- [x] 3.1 Motor: `lib/format.ts` (`formatPrice`: céntimos → `14,90 €`). Carrocería: `theme/ui/Button.tsx` (principal y desactivado); verificar con tests `1490 → "14,90 €"`, `0 → "0,00 €"`, y que el botón desactivado no llama a su acción
- [x] 3.2 Motor: `lib/stock.ts` (`getStockStatus(stock, umbral)` → agotado, quedan N o en stock, con su texto). Carrocería: `theme/ui/StockBadge.tsx`; verificar con tests de la función "Agotado" (0), "Quedan 3" (3, umbral 5) y "En stock" (12, umbral 5), y con un test de vista que la etiqueta muestra el texto que le da el motor
- [x] 3.3 Carrocería: `theme/ui/ProductCard.tsx` (marco con remaches, foto con `next/image`, etiqueta de stock, nombre, precio, descripción corta y botón), con sus datos en el contrato; verificar con tests el precio formateado y que un producto agotado muestra "Agotado" con el botón desactivado
- [x] 3.4 Motor: `hooks/useCategoryChips.ts` (usa `useDisclosure`, hecho en la 2.4) (chips visibles, resto en "Más" y texto de "Más" al elegir una del panel). Carrocería: `theme/ui/CategoryChips.tsx`; verificar con tests de los *hooks* cada regla y con tests de vista (user-event) que elegir una categoría del panel la marca y cambia el texto de "Más", y que el panel se cierra al pulsar fuera y con `Escape`
- [x] 3.5 Carrocería: `theme/ui/SearchBox.tsx` (campo con `<label>` y el cubo como icono decorativo); verificar con un test que el campo tiene rol de búsqueda y su etiqueta

## 4. Muestrario y revisión

- [x] 4.1 Crear `/muestrario` (motor) con datos de ejemplo sin marcas registradas, que muestra las piezas de la carrocería puesta y devuelve "no encontrado" en producción; verificar con tests que en desarrollo muestra todas las piezas y que con `NODE_ENV=production` llama a `notFound()`
- [x] 4.2 Revisión visual con la usuaria: comparar el muestrario y la portada con `DISENO.md` y las maquetas en escritorio y móvil, y ajustar lo que pida; verificar que da el visto bueno
- [x] 4.3 Comprobar la accesibilidad básica: navegar con el teclado por cabecera, chips y barra inferior (foco visible, `Escape` cierra el panel) y medir que los objetivos táctiles miden al menos 44 px; verificar anotando el resultado en el PR
- [x] 4.4 Pasar todas las comprobaciones (`npm run lint`, `format:check`, `tsc`, `test:coverage` ≥ 70% y `pre-commit run --all-files`); verificar que todo termina en verde

## 5. Prueba de libertad con otra IA

- [x] 5.1 Escribir `AGENTS.md` en la raíz (qué cambia una tienda: `src/theme/`, `src/config/`, `.env`; qué no: el resto; cómo comprobarlo) y la guía `docs/CAMBIAR_EL_DISENO.md` paso a paso; verificar que cada ruta y comando citado existe y funciona
- [ ] 5.2 (APLAZADA, 2026-11-16) Prueba: en un clon aparte y la rama `prueba/sakuribella-diseno` (no se sube ni se une), la usuaria pide a otra IA el aspecto de Sakuribella con solo esa documentación; verificar anotando en `openspec/changes/visual-identity/prueba-sakuribella.md` qué archivos tocó, si pasan el test del motor neutro, `tsc` y los tests de la lógica, dónde se atascó y cuánto tardó
- [ ] 5.3 (APLAZADA, 2026-11-16) Corregir en el motor o en la documentación cada atasco de la prueba, un commit por corrección; verificar que cada atasco anotado tiene su corrección o una decisión de dejarlo para más adelante

> **Aplazadas por decisión de la autora (2026-11-16):** la prueba necesita una IA que trabaje con los archivos del repositorio (por ejemplo, Codex), y por ahora no hay acceso. Se hará más adelante o junto con la prueba completa al terminar el MVP. `AGENTS.md` y `docs/CAMBIAR_EL_DISENO.md` (5.1) ya están listos para ese momento.

## 6. Documentación

- [x] 6.1 Actualizar `DISENO.md` (nombres de los tokens, adornos, contrastes medidos y pendientes resueltos), `CLAUDE.md` (estado, estructura con motor y carrocería, pendiente "logo en imagen" resuelto) y el README (hoja de ruta y, si la usuaria quiere, primera captura); verificar que las rutas y nombres citados existen

## 7. Integración final

- [x] 7.1 Subir la rama `feat/visual-identity` y abrir su Pull Request (con tu confirmación); verificar que los cuatro chequeos de la CI terminan en verde
- [ ] 7.2 Archivar el change (`docs: archiva visual-identity`) como último commit de la rama, con las specs pasadas a `openspec/specs/`; verificar que la CI sigue en verde y que la historia va de `docs: plan` a `docs: archiva`

## Workflow follow-up

- Unir el Pull Request a `main` con *merge commit* (con tu confirmación), actualizar `main` en local y borrar la rama; verificar que `git log --oneline` en `main` muestra el change completo.

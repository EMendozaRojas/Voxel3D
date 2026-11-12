# Tasks

## 1. Tema de la tienda

- [x] 1.1 Añadir `NEXT_PUBLIC_STORE_NAME` (en `.env.example`, en `docker-compose.yml` con el valor de `STORE_NAME`, como `ARG` en `frontend/Dockerfile` y en la CI) y usarlo en el título de la pestaña; verificar con un test que el título lleva el nombre de la tienda y que `docker build --target prod` termina sin errores
- [ ] 1.2 Crear `src/theme/fonts.ts` (Russo One, Rajdhani y Arimo con `next/font/google`, cada una con su variable CSS) y aplicarlas en `layout.tsx`, tras leer la guía de fuentes de `node_modules/next/dist/docs/`; verificar que `npm run build` termina sin errores y que el HTML de la portada no pide nada a `fonts.googleapis.com`
- [ ] 1.3 Crear `src/theme/theme.css` con los tokens neutros de color, degradados, radios y tamaños de `DISENO.md` (`@theme` de Tailwind) e importarlo desde `globals.css`; verificar que una clase como `bg-surface` o `text-accent` aplica el color del tema
- [ ] 1.4 Escribir `theme.contrast.test.ts` que lee `theme.css` y comprueba el contraste de cada pareja de texto y fondo (≥ 4,5:1, peor extremo en los degradados); ajustar lo mínimo los colores que no cumplan y apuntarlo en `DISENO.md`; verificar que el test pasa y que falla si se empeora un color a propósito (revertir después)
- [ ] 1.5 Añadir las variables de adornos (`--decor-*`: acero perforado, metal cepillado, línea de acento, remaches y barras) dibujadas con CSS; verificar en el navegador que se ven con el tema de Voxel3D y que, con todas a `none`/`0px`, la página sigue siendo legible (revertir después)
- [ ] 1.6 Escribir el test de "motor neutro": ningún archivo de `src/` fuera de `src/theme/` contiene colores hexadecimales, "Voxel3D" ni "cobre"; verificar que pasa y que falla si se añade un color a mano en un componente (revertir después)

## 2. Estructura común de las páginas

- [ ] 2.1 Crear `src/theme/brand.ts` y el componente `Logo` (texto con degradado o imagen, enlace a `/`); verificar con tests los dos tipos de logo (texto con el nombre de la tienda e imagen con su `alt`) y que ambos enlazan a la portada
- [ ] 2.2 Crear `src/config/navigation.ts` y `SiteHeader` (logo, menú con `aria-current`, botones de cuenta y carrito con contador y nombre accesible); verificar con tests la página activa, el contador con 3 unidades, el carrito vacío sin contador y los nombres "Mi cuenta" y "Carrito"
- [ ] 2.3 Crear `SiteFooter` con el aviso "Modo demostración: no se cobra dinero real." y `BottomNav` para el móvil (Inicio, Productos, Cuenta, Más, oculta en escritorio); verificar con tests que el aviso aparece y que la barra marca la página actual con `aria-current="page"`
- [ ] 2.4 Montar cabecera, `<main>`, pie y barra inferior en `layout.tsx` y dar a la portada (estado del servidor) el nuevo aspecto; verificar que los tests de `service-health` siguen pasando y, en el navegador, que escritorio y móvil (375 px) se ven como en `DISENO.md`

## 3. Piezas sueltas

- [ ] 3.1 Crear `src/lib/format.ts` (`formatPrice`: céntimos → `14,90 €`) y `Button` (principal y desactivado); verificar con tests `1490 → "14,90 €"`, `0 → "0,00 €"`, y que el botón desactivado no llama a su acción
- [ ] 3.2 Crear `StockBadge` con el umbral como prop; verificar con tests "Agotado" (0), "Quedan 3" (3, umbral 5) y "En stock" (12, umbral 5)
- [ ] 3.3 Crear `ProductCard` (marco, foto con `next/image`, etiqueta de stock, nombre, precio, descripción corta y botón); verificar con tests el precio formateado y que un producto agotado muestra "Agotado" con el botón desactivado
- [ ] 3.4 Crear `CategoryChips` con el botón "Más" y su panel en el móvil; verificar con tests (user-event) que elegir una categoría del panel la marca y cambia el texto de "Más", y que el panel se cierra al pulsar fuera y con `Escape`
- [ ] 3.5 Crear `SearchBox` (campo con `<label>` y el cubo del tema como icono decorativo); verificar con un test que el campo tiene rol de búsqueda y su etiqueta

## 4. Muestrario y revisión

- [ ] 4.1 Crear `/muestrario` con datos de ejemplo sin marcas registradas (`sample-data.ts`), que devuelve "no encontrado" en producción; verificar con tests que en desarrollo muestra todas las piezas y que con `NODE_ENV=production` llama a `notFound()`
- [ ] 4.2 Revisión visual con la usuaria: comparar el muestrario y la portada con `DISENO.md` y las maquetas en escritorio y móvil, y ajustar lo que pida; verificar que da el visto bueno
- [ ] 4.3 Comprobar la accesibilidad básica: navegar con el teclado por cabecera, chips y barra inferior (foco visible, `Escape` cierra el panel) y medir que los objetivos táctiles miden al menos 44 px; verificar anotando el resultado en el PR
- [ ] 4.4 Pasar todas las comprobaciones (`npm run lint`, `format:check`, `test:coverage` ≥ 70% y `pre-commit run --all-files`); verificar que todo termina en verde

## 5. Documentación

- [ ] 5.1 Actualizar `DISENO.md` (nombres de los tokens, adornos, contrastes medidos y pendientes resueltos), `CLAUDE.md` (el tema es una carpeta, estado, estructura, pendiente "logo en imagen" resuelto) y el README (hoja de ruta y, si la usuaria quiere, primera captura); verificar que las rutas y nombres citados existen

## 6. Integración final

- [ ] 6.1 Subir la rama `feat/visual-identity` y abrir su Pull Request (con tu confirmación); verificar que los cuatro chequeos de la CI terminan en verde
- [ ] 6.2 Archivar el change (`docs: archiva visual-identity`) como último commit de la rama, con las specs pasadas a `openspec/specs/`; verificar que la CI sigue en verde y que la historia va de `docs: plan` a `docs: archiva`

## Workflow follow-up

- Unir el Pull Request a `main` con *merge commit* (con tu confirmación), actualizar `main` en local y borrar la rama; verificar que `git log --oneline` en `main` muestra el change completo.

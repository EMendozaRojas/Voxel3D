# Design

## Context

El frontend es Next.js 16 (App Router), React 19, Tailwind 4.3 y TypeScript
estricto, con Vitest y React Testing Library. La identidad visual aprobada está
en `DISENO.md` (opción B "metálica"). Motivación y alcance en `proposal.md`.

Decisiones de la usuaria:

1. **Alcance A** (2026-11-11): estructura común + piezas sueltas + página
   `/muestrario`, sin productos inventados en la portada.
2. **Logo A** (2026-11-11): texto con CSS, con opción de imagen.
3. **Chasis y carrocería, opción A** (2026-11-12): el diseño de cada tienda es
   libre, también la forma de las piezas. Sustituye a la decisión anterior de
   "adornos que se apagan con variables", que solo permitía cambiar colores y
   adornos.
4. **Prueba con otra IA** (2026-11-12): una pequeña al final de este change
   (solo diseño) y la completa al final del MVP.

Restricciones:

- En el ordenador no hay Node: todo corre en contenedores.
- Next.js 16 trae su propia documentación en `node_modules/next/dist/docs/`;
  se lee antes de escribir código de Next (lo pide `frontend/AGENTS.md`).
- Las mejoras del motor llegan a cada tienda con `git pull upstream main`: para
  que no choquen con su diseño, una tienda **no edita archivos del motor**.

## Goals / Non-Goals

**Goals:**

- Que una tienda pueda cambiar **todo lo que se ve** (también la forma y la
  disposición) editando solo su carrocería.
- Que la lógica de cada pieza se escriba y se pruebe **una sola vez**, en el
  motor.
- Que otra IA, sin conocer nuestras conversaciones, pueda cambiar el diseño
  siguiendo solo la documentación.
- Accesibilidad desde el principio: contraste 4,5:1, objetivos táctiles de
  44 px, elementos reales y `aria-current`.

**Non-Goals:**

- Datos reales, páginas de destino del menú y búsqueda (ver `proposal.md`).
- Cambiar el diseño desde el panel, sin código.
- Un sistema de *plugins* o de temas instalables: la carrocería es una carpeta.
- Una librería de componentes externa (shadcn, MUI) o Storybook: con pocas
  piezas, el muestrario cubre lo mismo sin otra herramienta.

## Decisions

### 1. Chasis (lógica) y carrocería (aspecto)

```
frontend/src/
├── app/            MOTOR · rutas: obtienen los datos y llaman a la vista
├── features/       MOTOR · funcionalidades (hoy, health)
├── hooks/          MOTOR · comportamiento: abrir y cerrar paneles, chips…
├── lib/            MOTOR · funciones puras (precio, stock, página activa)
│   └── theme-contract.ts   qué datos recibe cada pieza de la carrocería
├── config/         TIENDA · nombre de la tienda y textos del menú
└── theme/          TIENDA · la carrocería, libre
    ├── theme.css   colores, degradados, esquinas y adornos
    ├── fonts.ts    tipografías
    ├── brand.ts    logo: texto o imagen
    ├── layout/     StoreLayout, SiteHeader, SiteFooter, BottomNav, Logo
    └── ui/         Button, StockBadge, ProductCard, CategoryChips, SearchBox
```

- **El motor decide qué pasa** ("¿quedan pocas unidades?", "¿está abierto el
  panel?"); **la carrocería decide cómo se ve**. Ejemplo: `getStockStatus(3, 5)`
  (motor) devuelve `{ kind: "low", label: "Quedan 3" }`; el `StockBadge` de
  Voxel3D lo pinta como una etiqueta de cobre y el de Sakuribella podría
  pintarlo como un corazón.
- **La disposición también es de la tienda.** `app/layout.tsx` (motor) solo
  pone `<html>`, las fuentes y los Providers, y llama a `StoreLayout` de la
  carrocería, que decide dónde van la cabecera, el pie y la barra inferior. Las
  páginas futuras seguirán el mismo patrón: la ruta obtiene los datos y se los
  pasa a una vista del tema.
- **Cada carrocería tiene sus tests de vista** (en `theme/`), y el motor, los de
  la lógica. Si Sakuribella rehace una pieza, rehace también sus tests de
  vista; los de la lógica siguen valiendo.

*Alternativa:* que cada tienda edite las piezas del motor. Se descarta: al
recibir mejoras del padre habría conflictos en cada archivo tocado.

*Alternativa:* solo variables de adornos (`--decor-*`) que se apagan. Se
descarta (era la decisión anterior): solo cambia colores y adornos, no la forma.

### 2. Contrato con tipos de TypeScript

`lib/theme-contract.ts` define los datos que recibe cada pieza
(`StockBadgeProps`, `ProductCardProps`, `SiteHeaderProps`…). Las piezas de la
carrocería los usan, y las rutas del motor les pasan esos datos. Si una
carrocería nueva olvida un dato o lo llama distinto, `tsc` falla antes de
construir. Es el "enchufe" entre chasis y carrocería: la carrocería puede tener
cualquier forma mientras encaje en el enchufe.

*Alternativa:* un test que compruebe la lista de componentes. Se descarta:
TypeScript ya lo comprueba, con mensajes más claros y sin código extra.

### 3. El motor no conoce ninguna tienda

Un test recorre los archivos del motor (todo `src/` salvo `theme/` y `config/`)
y falla si encuentra colores escritos a mano (`#xxxxxx`), "Voxel3D" o "cobre".
En la prueba con otra IA sirve también de alarma: si toca el motor para
cambiar el diseño, salta.

### 4. Tokens con nombres por su papel (dentro de la carrocería)

`theme.css` usa `@theme` de Tailwind con nombres por papel (`--color-accent`,
`--color-on-button`, `--color-surface`…), y los degradados como variables
(`--gradient-button`), con un color liso de respaldo del mismo papel. Ya hecho
en la tarea 1.3.

Los nombres son una ayuda **de Voxel3D**, no una obligación del motor:
`theme.tokens.test.ts` vive en `theme/` y comprueba los tokens que usan *sus*
piezas. Si Sakuribella rehace sus piezas con otros tokens, cambia también su
lista.

### 5. Adornos de Voxel3D con CSS

El acero perforado, el metal cepillado, los remaches y las barras de cobre se
dibujan con degradados CSS en `theme.css` (clases como `.decor-perforated` o
`.decor-rivets`), sin imágenes. Son solo de Voxel3D: otra tienda no los usa o
los borra.

### 6. Logo: texto por defecto, imagen opcional

`theme/layout/Logo.tsx` lee `brand.ts`. Con `{ type: "text" }` escribe el
nombre de la tienda con `--font-logo` y `--gradient-logo`; con
`{ type: "image", src, alt }` usa `next/image`. Siempre enlaza a `/`.

### 7. Nombre de la tienda: `NEXT_PUBLIC_STORE_NAME`

Sale de `STORE_NAME` (compose y CI), se escribe en el código al construir y,
si falta, la construcción falla. Titula la portada y las demás páginas añaden
" · <tienda>". Ya hecho en la tarea 1.1.

### 8. Fuentes con `next/font/google`

En `theme/fonts.ts`, cada una con su variable `--font-store-*`, que `theme.css`
conecta con `font-logo`, `font-label` y `font-body`. Se sirven desde la propia
web. Ya hecho en la tarea 1.2.

### 9. Lógica de las piezas en el motor

- `lib/format.ts`: `formatPrice(1490)` → `14,90 €` (céntimos, `es-ES`, `EUR`).
- `lib/stock.ts`: `getStockStatus(stock, umbral)` → agotado / quedan N / en
  stock, con su texto. El umbral se decide en `inventory`.
- `lib/navigation.ts`: `isActivePath(rutaActual, enlace)` para `aria-current`.
- `hooks/useDisclosure.ts`: abrir y cerrar un panel, con `Escape` y pulsando
  fuera.
- `hooks/useCategoryChips.ts`: cuántos chips se ven, cuáles van al panel "Más"
  y qué texto lleva "Más" cuando se elige una categoría del panel.
- `config/navigation.ts`: enlaces del menú y de la barra inferior (textos de la
  tienda).

### 10. `/muestrario` solo en desarrollo

`app/muestrario/page.tsx` llama a `notFound()` si `NODE_ENV === "production"`.
Usa datos de ejemplo sin marcas registradas. Muestra las piezas de la
carrocería que esté puesta, así que también sirve para la prueba de Sakuribella.

### 11. Contraste comprobado con un test

`theme/theme.contrast.test.ts` lee `theme.css` y comprueba las parejas de texto
y fondo de Voxel3D con la fórmula de WCAG (≥ 4,5:1; en un degradado, el
extremo peor). Si un valor de `DISENO.md` no llega, se propone el ajuste a la
usuaria antes de cambiarlo y se apunta en `DISENO.md`.

### 12. Prueba de libertad con otra IA

- **`AGENTS.md`** en la raíz: qué carpetas cambia una tienda (`src/theme/`,
  `src/config/`, `.env`) y cuáles no (el resto), y cómo comprobarlo. Casi todas
  las IAs de programación lo leen solas.
- **`docs/CAMBIAR_EL_DISENO.md`**: guía breve, paso a paso, para cambiar la
  carrocería. La guía completa "Cómo crear una tienda nueva" llega al final del
  MVP.
- **La prueba:** en un clon aparte, rama `prueba/sakuribella-diseno` (no se
  sube ni se une), la usuaria pide a otra IA el aspecto de Sakuribella con
  solo esa documentación. Se anota en
  `openspec/changes/visual-identity/prueba-sakuribella.md`: qué archivos tocó,
  si los tests y `tsc` pasan, dónde se atascó y cuánto tardó. Cada atasco se
  corrige con su propio commit.

## Risks / Trade-offs

- **Separar lógica y vista cuesta algo más ahora** → a cambio, la lógica se
  prueba una sola vez y el diseño de cada tienda es libre.
- **Si Chasis mejora una pieza de la carrocería de ejemplo, esa mejora no llega
  sola a las tiendas** que la rehicieron → es lo esperado: el diseño es suyo. Lo
  que conviene compartir va al motor (lógica) o al contrato.
- **Next.js 16 es muy nuevo** → leer su documentación local antes de cada pieza.
- **`next/font/google` necesita internet al construir** → si algún día falla,
  se copian las fuentes al repositorio con `next/font/local`.
- **Los adornos con CSS pueden no quedar iguales que la maqueta** → la usuaria
  los compara con el muestrario en la revisión visual antes de cerrar.
- **La otra IA puede hacerlo distinto a como lo haríamos nosotras** → no es un
  fallo: la prueba mide si la documentación basta, no si copia nuestro estilo.

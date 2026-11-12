# Design

## Context

El frontend es Next.js 16 (App Router), React 19, Tailwind 4 y TypeScript
estricto, con Vitest y React Testing Library. Hoy `globals.css` solo importa
Tailwind y la portada muestra el estado del servidor. La identidad visual
aprobada está en `DISENO.md` (opción B "metálica"). Motivación y alcance en
`proposal.md`.

Decisiones ya tomadas por la usuaria (2026-11-11):

1. **Alcance A:** estructura común + piezas sueltas + página `/muestrario`, sin
   productos inventados en la portada.
2. **Tema B:** el tema decide también los adornos, que se pueden apagar.
3. **Logo A:** texto con CSS, con opción de imagen en el tema.

Restricciones:

- En el ordenador no hay Node: todo corre en contenedores.
- Next.js 16 trae su propia documentación en `node_modules/next/dist/docs/`;
  se lee antes de escribir código de Next (lo pide `frontend/AGENTS.md`).
- El motor no debe contener nada propio de Voxel3D (`CLAUDE.md`).

## Goals / Non-Goals

**Goals:**

- Que cambiar de tienda signifique **cambiar la carpeta del tema**, sin tocar
  ningún componente.
- Que cada pieza se pruebe sola, con datos de ejemplo.
- Accesibilidad desde el principio: contraste 4,5:1, objetivos táctiles de
  44 px, elementos reales y `aria-current`.

**Non-Goals:**

- Datos reales, páginas de destino del menú y búsqueda (ver `proposal.md`).
- Una librería de componentes externa (shadcn, MUI) o Storybook: con pocas
  piezas, el muestrario cubre lo mismo sin otra herramienta.

## Decisions

### 1. El tema es una carpeta, no un archivo

```
frontend/src/theme/
├── theme.css     # tokens (colores, radios, tamaños) y adornos, con @theme de Tailwind
├── fonts.ts      # fuentes con next/font/google, cada una con su variable CSS
└── brand.ts      # logo: { type: "text" } o { type: "image", src, alt }
```

`CLAUDE.md` hablaba de "un único archivo de tema". Hacen falta tres porque
`next/font` solo funciona desde TypeScript y los colores viven en CSS. La regla
sigue siendo la misma: **todo lo que cambia de una tienda a otra está en un
solo sitio**. Se corrige la frase en `CLAUDE.md`.

*Alternativa:* un `theme.ts` que genere el CSS. Se descarta: añade un paso de
generación y Tailwind 4 ya lee los tokens directamente del CSS.

### 2. Tokens con nombres neutros (por su papel, no por su color)

En `theme.css`, con la directiva `@theme` de Tailwind 4, los tokens se nombran
por **para qué sirven**: `--color-page`, `--color-surface`, `--color-text`,
`--color-text-muted`, `--color-accent`, `--color-accent-strong`,
`--color-on-accent`, `--color-button`, `--color-on-button`… Así Tailwind crea
clases como `bg-surface` o `text-accent`, y en Sakuribella `accent` será rosa
sin cambiar ningún componente.

Los degradados de `DISENO.md` se guardan como variables propias
(`--gradient-button`, `--gradient-chip-active`…), porque Tailwind no tiene
tokens de degradado.

Un test comprueba que ningún archivo fuera de `src/theme/` contiene colores
escritos a mano (`#xxxxxx`) ni las palabras "Voxel3D" o "cobre".

### 3. Adornos que se pueden apagar

Los adornos de Voxel3D son variables del tema:

| Variable | Voxel3D | Tema sin adornos |
|---|---|---|
| `--decor-header-pattern` | puntos de acero perforado | `none` |
| `--decor-page-texture` | líneas de metal cepillado | `none` |
| `--decor-rivets` | remaches en las esquinas de la tarjeta | `none` |
| `--decor-card-bars` | barras laterales de cobre | `0px` |
| `--decor-accent-line` | línea de 4 px bajo la cabecera | `0px` |

Los componentes los usan siempre (`background-image: var(--decor-rivets)`);
apagarlos es dar el valor `none` o `0px` en el tema. Los remaches y el acero
perforado se dibujan con degradados CSS, sin imágenes.

*Alternativa:* un interruptor `decorations: true/false` en `brand.ts` con `if`
en cada componente. Se descarta: llena el motor de condiciones y no permite
cambiar un adorno por otro (por ejemplo, flores en vez de remaches).

### 4. Logo: texto por defecto, imagen opcional

`<Logo />` lee `brand.ts`. Con `{ type: "text" }` escribe el nombre de la tienda
con la fuente y el degradado del tema (`--font-logo`, `--gradient-logo`,
`--logo-glow`). Con `{ type: "image", src, alt }` muestra la imagen con
`next/image`. El logo siempre es un enlace a la portada.

### 5. Nombre de la tienda en el frontend: `NEXT_PUBLIC_STORE_NAME`

El logo y el título de la pestaña necesitan el nombre. Se añade
`NEXT_PUBLIC_STORE_NAME` y, para no repetirlo, en `docker-compose.yml` se le da
el valor de `STORE_NAME`. En `.env.example` y en la CI se toma del mismo sitio.
Como toda variable `NEXT_PUBLIC_`, se escribe dentro del código al construir:
el `Dockerfile` la recibe como `ARG`, igual que `NEXT_PUBLIC_API_URL`.

*Alternativa:* pedir el nombre al backend. Se descarta por ahora: añade una
petición en cada página para un dato que no cambia. Dónde vive la configuración
de la tienda se decide en `guest-checkout` (ver `CLAUDE.md`).

### 6. Fuentes con `next/font/google`

Russo One (logo), Rajdhani 500/600/700 (menú, botones, etiquetas) y Arimo
400/700 (textos y precios), cada una con su variable CSS (`--font-logo`,
`--font-label`, `--font-body`), que `theme.css` conecta con Tailwind. Next.js
las descarga al construir y las sirve desde la propia web: el navegador de la
persona no habla con Google (mejor privacidad y no hay salto de fuente).

### 7. Componentes del motor

```
frontend/src/components/
├── layout/   # SiteHeader, SiteFooter, BottomNav, DemoNotice, Logo
└── ui/       # Button, CategoryChips, SearchBox, ProductCard, StockBadge
```

- Reciben **todo por props** (textos, enlaces, categorías, producto): no
  conocen el catálogo ni la tienda. El texto de los enlaces del menú vive en
  una lista de navegación en `src/config/navigation.ts`, en español.
- Elementos reales: `<a>`/`<Link>`, `<button>`, `<input>` con `<label>`.
- `StockBadge` decide el texto: `stock = 0` → "Agotado", `stock ≤ umbral` →
  "Quedan N", resto → "En stock". El umbral es una prop (se decide en
  `inventory`).
- Precios en céntimos (regla del proyecto) y formateados con `Intl.NumberFormat`
  `es-ES`/`EUR` (`1490` → `14,90 €`), en `src/lib/format.ts`.
- `CategoryChips` en el móvil muestra las tres primeras y un botón "Más" que
  abre un panel; se cierra al pulsar fuera o con `Escape`.

### 8. `/muestrario` solo en desarrollo

`app/muestrario/page.tsx` llama a `notFound()` si `NODE_ENV === "production"`.
Usa datos de ejemplo de `src/app/muestrario/sample-data.ts`, sin marcas
registradas.

*Alternativa:* dejarlo público como escaparate para el portafolio. Se descarta:
una página con datos falsos en la tienda real confunde; para el portafolio se
harán capturas.

### 9. Contraste comprobado con un test

`theme.contrast.test.ts` lee `theme.css`, toma las parejas de texto y fondo
que importan (texto sobre página, texto sobre cabecera, texto del botón, texto
del chip activo, texto de la etiqueta de stock, enlace activo) y calcula el
contraste con la fórmula de WCAG. Para un degradado se usa el color del
extremo que da peor contraste. Si un valor de `DISENO.md` no llega a 4,5:1, se
ajusta lo mínimo y se apunta el cambio en `DISENO.md`.

## Risks / Trade-offs

- **Next.js 16 es muy nuevo** → leer su documentación local antes de cada
  pieza (fuentes, `next/image`, `notFound`).
- **`next/font/google` necesita internet al construir** → la CI lo tiene; si
  algún día falla, se copian las fuentes al repositorio con `next/font/local`.
- **Los adornos con CSS pueden no quedar iguales que la maqueta** → la usuaria
  los compara con el muestrario en la tarea de revisión visual antes de cerrar.
- **`layout.tsx` sin cobertura en Vitest** (es un componente de servidor) → la
  cabecera, el pie y la barra se prueban como componentes sueltos; el layout lo
  cubrirá Playwright.

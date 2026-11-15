# Cambiar el diseño de la tienda

Guía paso a paso para dar a la tienda otro aspecto (otra "carrocería") sin
tocar el motor. Antes, lee [`AGENTS.md`](../AGENTS.md): explica qué carpetas
son de la tienda y cuáles del motor.

Todas las rutas de esta guía son relativas a `frontend/src/` salvo que se diga
otra cosa.

## 0. Arrancar y mirar

```bash
cp .env.example .env           # solo la primera vez
docker compose up -d --build
```

Abre http://localhost:3000 (portada) y http://localhost:3000/muestrario (todas
las piezas con datos de ejemplo). Ten el muestrario abierto mientras trabajas:
los cambios se ven al guardar.

## 1. Nombre de la tienda

En `.env` (raíz del proyecto), cambia `STORE_NAME`. El nombre sale en la
pestaña del navegador, en el logo de texto y en el pie. Después:

```bash
docker compose up -d --force-recreate backend frontend
docker compose exec backend python -m scripts.export_openapi
```

El segundo comando actualiza `backend/openapi.json`, que lleva el nombre en su
título (si no, un test del backend avisa de que no está al día).

## 2. Escribir el diseño

Antes de programar, apunta en `DISENO.md` (raíz) la paleta, las tipografías y
cómo es cada pieza. Es la referencia para revisar el resultado.

## 3. Colores, degradados y esquinas: `theme/theme.css`

- Los colores van en el bloque `@theme` como `--color-<papel>`. Tailwind crea
  sus clases solo: `--color-surface` → `bg-surface`, `text-surface`…
- Los degradados van en `:root` como `--gradient-<papel>` y se usan con
  `bg-(image:--gradient-<papel>)`.
- Usa nombres por su **papel** (`accent`, `surface`, `on-button`), no por su
  color (`rosa`, `dorado`): así las piezas se leen igual aunque cambies el
  valor.
- Puedes cambiar los valores, añadir tokens o rehacer la lista entera.

Actualiza también sus dos tests, que son de la tienda:

- `theme/theme.tokens.test.ts`: la lista de tokens que usan **tus** piezas.
- `theme/theme.contrast.test.ts`: las parejas de texto y fondo de **tu**
  diseño. Todas deben dar al menos 4,5:1 (iconos, 3:1).

## 4. Tipografías: `theme/fonts.ts`

Elige fuentes de Google Fonts y cámbialas en el `import` de `next/font/google`.
Mantén las tres variables (`--font-store-logo`, `--font-store-label`,
`--font-store-body`) o cambia también su conexión en `theme.css` (bloque
`@theme inline`) y el test `theme/fonts.test.ts`. El archivo tiene que seguir
exportando `fontVariables`.

## 5. Logo: `theme/brand.ts`

- `{ type: "text" }`: escribe el nombre de la tienda con la fuente y el
  degradado del logo.
- `{ type: "image", src, alt, width, height }`: usa una imagen guardada en
  `frontend/public/` (por ejemplo `src: "/logo.svg"`). `width` y `height` son
  el tamaño real del archivo.

La pieza que lo pinta es `theme/layout/Logo.tsx`; puedes cambiarla.

## 6. Adornos

Los adornos de la tienda actual (acero perforado, remaches, barras…) son
clases `decor-*` en `theme.css`. Bórralos o cámbialos por los tuyos (por
ejemplo, puntos, brillos o bordes ondulados), dibujados con CSS.

## 7. Piezas y disposición

Todo lo de `theme/layout/`, `theme/ui/` y `theme/pages/` se puede rehacer: otra
forma, otro orden, otra disposición. Solo hay que respetar el **contrato**:
los archivos, nombres y props de la tabla de `AGENTS.md`. Para la lógica
(página activa, precios, stock, paneles), usa las funciones y *hooks* del
motor que lista `AGENTS.md`.

Si rehaces una pieza, rehaz también su test en la misma carpeta
(`Pieza.test.tsx`).

## 8. Enlaces y textos fijos: `config/`

- `config/navigation.ts`: enlaces de la cabecera, de la barra del móvil y del
  panel "Más".
- `config/showcase.ts`: productos y categorías de ejemplo del muestrario.
- `config/store.ts`: aviso de modo demostración, idioma y moneda. El aviso
  tiene que seguir viéndose en todas las páginas.

## 9. Comprobar

```bash
docker compose exec frontend npx tsc --noEmit
docker compose exec frontend npm run test:coverage
docker compose exec frontend npm run lint
docker compose exec frontend npm run format
```

Y en el navegador, en escritorio y en móvil (F12 y después Ctrl+Shift+M):

- [ ] Portada, `/muestrario` y una página que no existe (la 404) se ven como
      en `DISENO.md`.
- [ ] Ninguna página se desplaza en horizontal en el móvil (375 px).
- [ ] Con la tecla Tab se ve dónde está el foco, y `Escape` cierra los paneles.
- [ ] Los botones y enlaces miden al menos 44 × 44 px.
- [ ] El aviso de modo demostración se ve en todas las páginas.
- [ ] `git status` solo muestra cambios en `frontend/src/theme/`,
      `frontend/src/config/`, `frontend/public/`, `DISENO.md` y, si cambiaste
      el nombre, `backend/openapi.json` (`.env` no sale: git lo ignora a
      propósito porque guarda secretos).

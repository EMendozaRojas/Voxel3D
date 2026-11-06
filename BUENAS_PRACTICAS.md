# Buenas prácticas de Voxel3D

Basadas en el estándar de mercado para el stack elegido (FastAPI + Next.js /
TypeScript + PostgreSQL + Docker) y heredadas de ExpenseTrack, con los errores
que allí se cometieron ya corregidos. Pensadas para un proyecto personal de
aprendizaje, pero replicando prácticas reales de la industria, ya que uno de
los objetivos es servir de portafolio.

## Backend (Python / FastAPI)

**Monolito modular.** El código se agrupa por tema (`catalog`, `cart`,
`orders`, `inventory`, `payments`, `users`, `shipping`) y dentro de cada módulo
va en capas: `routers` (endpoints) → `services` (lógica de negocio) →
`models` (acceso a datos) → `schemas` (validación Pydantic). Nada de lógica de
negocio dentro de los routers, y nunca todo el backend en un solo `main.py`.

**Calidad de código:** [Ruff](https://docs.astral.sh/ruff/) para lint +
formato y **mypy** para tipos, configurados en `pyproject.toml`.

**Tipado:** funciones y modelos siempre tipados; nada de `Any` salvo
justificación explícita.

**Dinero:** los importes se guardan como **enteros en céntimos** (o `Decimal`),
nunca como `float`, para evitar errores de redondeo. Se muestran con el
formato `14,90 €`.

**Configuración:** `pydantic-settings` para leer variables de entorno con
validación "fail fast" (el backend no arranca si falta una variable
requerida).

**Errores:** respuesta consistente en toda la API con el formato estándar de
FastAPI: `{"detail": "<mensaje en español>"}`. Se usan `HTTPException` y los
errores de cada endpoint se documentan en OpenAPI con un esquema común.

**Migraciones:** todo cambio de esquema pasa por Alembic. Nunca se modifica la
base de datos a mano. Una instalación limpia (`docker compose down -v` y
`up`) debe funcionar siempre.

**Transacciones:** las operaciones que tocan stock o pagos van dentro de una
transacción, con bloqueo de fila cuando haya competencia por el mismo dato.

## Frontend (Next.js + TypeScript + Tailwind)

**TypeScript en modo `strict`**, evitando `any`; union types discriminados para
estados (cargando / error / correcto).

**Calidad de código:** ESLint + Prettier.

**Estructura por features**, no por tipo de archivo: cada funcionalidad
(`catalog/`, `cart/`, `checkout/`, `account/`, `admin/`) agrupa sus
componentes, hooks y tipos; `src/components/` queda solo para piezas
compartidas.

**Componentes de servidor por defecto.** En Next.js, un componente solo se
marca como "de cliente" cuando necesita interactividad (carrito, formularios,
filtros). Así se envía menos JavaScript y mejora el SEO.

**Estilos con Tailwind y tokens de diseño.** Los colores, tipografías y
espaciados salen de las variables definidas en `DISENO.md`; no se escriben
colores sueltos en los componentes.

**Formularios:** validación con esquemas tipados (React Hook Form + Zod) y los
mismos límites que el backend.

**Estado:** `useState` para estado local de UI; los datos del servidor se
piden y se cachean con una única herramienta (se elige en el esqueleto). Nada
de Redux para un proyecto de este tamaño.

**Accesibilidad:** elementos reales (`<button>`, `<a>`, `<input>` con
`<label>`), nombres accesibles en iconos, contraste de texto de al menos 4,5:1,
objetivos táctiles de al menos 44 px y navegación completa con teclado.

## Testing

- **Backend (pytest):** sobre su propia base de datos (`<POSTGRES_DB>_test`),
  que se recrea y se migra al empezar cada ejecución; cada test va en una
  transacción con rollback. Los tests **nunca** tocan la base de desarrollo
  ni envían emails ni llaman a Stripe de verdad.
- **Fecha fija:** si una regla depende del día, el "hoy" se fija en el test.
- **Frontend (Vitest + React Testing Library):** enfocado en lo que ve y hace
  la usuaria, no en detalles internos.
- **Extremo a extremo (Playwright):** pocos tests de los recorridos críticos
  (comprar como invitada, iniciar sesión, gestionar un producto).
- **Seguridad con tests:** un cliente recibe `403` en las rutas de
  administración; un cliente no puede ver el pedido de otra persona cambiando
  el identificador (*IDOR*); el webhook rechaza firmas inválidas y no
  procesa dos veces el mismo evento.
- **Cobertura mínima: 70%**, como un piso y no como objetivo a perseguir con
  tests superficiales. Prioridad: reglas de negocio (stock, pagos, estados) y
  endpoints críticos.
- **Lo que asegura que funciona no es el porcentaje:** cada escenario de las
  specs de OpenSpec tiene al menos un test, y cada test comprueba un
  resultado concreto (qué se ve, qué responde la API, qué cambia en la base).
  Un test que solo ejecuta código sin comprobar nada no vale, aunque suba la
  cobertura.

## Diseño de la API

- Prefijo de versión: `/api/v1/...`.
- Recursos en plural (`/products`, `/orders`), sin verbos en la URL salvo
  acciones explícitas (`/orders/{id}/cancel`).
- Códigos HTTP correctos: `201` al crear, `404` si no existe, `403` sin
  permiso, `409` en conflicto (por ejemplo, sin stock), `422` en validación.
- **Paginación** en los listados que crecen (productos, pedidos), con filtros
  y orden en la propia petición.
- Documentación en español en `/docs` y contrato versionado en
  `backend/openapi.json`; un test falla si no está al día.

## Seguridad

- **El servidor comprueba el rol en cada petición.** Ocultar un botón en la
  pantalla no protege nada.
- **Contraseñas** con bcrypt, con longitud mínima y máxima. Nunca se guardan
  ni se registran en claro.
- **Cookies** de sesión y de carrito con `HttpOnly`, `Secure` (en producción) y
  `SameSite`.
- **Stripe:** la app nunca recibe datos de tarjeta. Los webhooks se aceptan
  solo con firma válida y son idempotentes.
- **Validación de todas las entradas** con límites de tamaño (textos,
  imágenes, cantidades). Un dato raro da `422`, no `500`.
- **Límite de intentos** en inicio de sesión y recuperación de contraseña.
- **Pedidos de invitado:** enlaces firmados con caducidad; nunca basta el
  número de pedido.
- **Dependencias:** `pip-audit` y `npm audit` en la CI, y Dependabot para
  avisos y actualizaciones.
- **Secretos:** nunca en el código ni en el historial de Git. Se activa el
  escaneo de secretos de GitHub.
- **Datos personales:** se guardan solo los necesarios (nombre, email,
  dirección, teléfono) y los usuarios pueden eliminar su cuenta.

## Docker

- **Multi-stage builds** en ambos Dockerfiles, con una etapa `dev` (recarga en
  caliente) y una etapa final mínima de **producción**, porque sí habrá
  despliegue.
- Contenedores con **usuario no-root**.
- `.dockerignore` en ambos proyectos (mínimo: `.env`, `.git`,
  `__pycache__`, `node_modules`, `.next`).
- El `.env` **nunca** se copia dentro de la imagen; las variables se inyectan
  en tiempo de ejecución vía Docker Compose.

## Configuración y secretos

- `.env.example` versionado con las variables necesarias (sin valores reales);
  el `.env` real está en `.gitignore`.
- Solo claves de **prueba** de Stripe (`sk_test_…`). Las variables
  `NEXT_PUBLIC_…` se ven en el navegador: nunca llevan secretos.

## Git y commits

- **Conventional Commits** desde el primer commit (`feat:`, `fix:`, `chore:`,
  `docs:`, `test:`, `refactor:`): prefijo en inglés y el resto del mensaje en
  español (ej. `feat: carrito de invitada con cookie anónima`).
- **Ramas y Pull Requests** aunque trabaje sola (`feat/catalogo`,
  `fix/webhook-duplicado`). La rama `main` siempre funciona y estará
  protegida: no se une nada sin pasar la CI.
- **Un change de OpenSpec empieza con `docs: plan <change>` y termina con
  `docs: archiva <change>`.** En medio van los commits pequeños de cada
  tarea, que se conservan al unir la rama (Pull Request con *merge commit*,
  sin aplastarlos): así la historia muestra cómo se hizo cada paso y por qué.
- Commits pequeños y con un solo propósito.
- **Pre-commit hooks** ([pre-commit](https://pre-commit.com/)): corren Ruff,
  mypy, ESLint, Prettier y la validación de Conventional Commits antes de cada
  commit. Se activan en el change del esqueleto, no después.

## CI/CD

- **CI (GitHub Actions)** en cada push y pull request. Backend: Ruff (lint y
  formato), mypy, `pip-audit` y pytest con Postgres y cobertura. Frontend:
  ESLint, Prettier, Vitest con cobertura, build de producción y Playwright.
  Como los tests migran una base vacía, también vigila que el proyecto
  arranque desde cero.
- **CD:** al unir un cambio a `main` con la CI en verde, la aplicación se
  despliega sola (change `deployment`).
- **Dependabot** para mantener las dependencias al día.

## Instalación de pre-commit

Una sola vez por máquina (en Ubuntu):

```bash
sudo apt install pre-commit
pre-commit install --hook-type pre-commit --hook-type commit-msg
```

mypy, ESLint y Prettier se ejecutan **dentro de los contenedores**
(`docker compose exec`), porque en el ordenador no hay Node ni las librerías
del backend: hace falta tener el proyecto levantado (`docker compose up -d`)
para poder hacer commit. Para pasarlos sobre todo el repo:
`pre-commit run --all-files`.

## Protección de `main`

En GitHub, la rama `main` está protegida para que **siempre funcione**:

- Solo se cambia con un **Pull Request**; nadie puede subir commits
  directamente, tampoco la administradora del repositorio.
- El Pull Request solo se puede unir si los **cuatro chequeos de la CI** están
  en verde: `backend`, `frontend`, `docker (backend)` y `docker (frontend)`
  (el trabajo `docker` se divide en dos, uno por imagen).
- La rama tiene que estar **al día con `main`** antes de unirla, para que la CI
  haya probado el resultado final.
- **Cero aprobaciones obligatorias:** hay una sola persona en el proyecto.
- No se puede reescribir (`force push`) ni borrar `main`.

Se activa **después** de que la CI haya pasado una vez en GitHub: antes, los
nombres de los chequeos no existen. Se configura con la API de GitHub:

```bash
gh api -X PUT repos/EMendozaRojas/Voxel3D/branches/main/protection --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["backend", "frontend", "docker (backend)", "docker (frontend)"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": { "required_approving_review_count": 0 },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```

Para comprobarla: `gh api repos/EMendozaRojas/Voxel3D/branches/main/protection`.
Si un día la CI se rompe por algo ajeno al proyecto y bloquea un arreglo
urgente, se puede relajar desde *Settings → Branches* del repositorio; después
se vuelve a activar con el mismo comando.

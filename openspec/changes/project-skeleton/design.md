# Design

## Context

El repositorio contiene hoy solo documentación (`CLAUDE.md`, `BUENAS_PRACTICAS.md`,
`DISENO.md`) y OpenSpec. No hay código ni specs. Las decisiones de stack están
cerradas en `CLAUDE.md`; aquí se decide **cómo se monta el esqueleto**.
Motivación y alcance en `proposal.md`.

Restricciones:

- En el ordenador solo hay Docker y Git: **no hay Node** y Python no se usa
  directamente. Todo corre en contenedores.
- ExpenseTrack (`/home/esthefany/project/ExpenseTrack`) ya resolvió Compose, CI y
  pre-commit para FastAPI + React. Se reutiliza su enfoque y se corrigen sus
  errores conocidos (CI y hooks tardíos, migraciones en instalación limpia,
  tests sobre la base de desarrollo).
- Los comandos de arranque, puertos y variables salen de `.env.example`
  (frontend `3000`, backend `8000`, Mailhog `8025`, PostgreSQL `5432`).

## Goals / Non-Goals

**Goals:**

- Que `docker compose up --build` funcione en una máquina limpia y también tras
  `down -v`.
- Que cada pieza (base de datos, API, frontend, tests, hooks, CI) se pruebe por
  separado, con lo mínimo de código.
- Dejar los nombres, carpetas y convenciones listos para que los siguientes
  changes solo añadan módulos.

**Non-Goals:**

- Ninguna regla de negocio, tabla de negocio, autenticación ni estilo visual.
- Optimizar imágenes o la CI más allá de lo necesario.
- Elegir plataforma de despliegue (`deployment`).

## Decisions

### 1. Estructura del repositorio

`backend/` y `frontend/` independientes, con `docker-compose.yml` y `.env` en la
raíz.

*Alternativa:* un monorepo con gestor de espacios de trabajo (npm workspaces,
Turborepo). Se descarta: el backend es Python, así que no aporta nada y añade
una herramienta más.

### 2. Backend: monolito modular, un módulo por tema

```
backend/app/
├── core/         # config.py (ajustes), db.py (motor y sesión), openapi.py (metadatos)
├── modules/
│   └── health/   # router.py (y service.py cuando haya lógica)
└── main.py       # crea la app, CORS y monta los routers bajo /api/v1
```

Cada módulo futuro (`catalog`, `orders`…) repite la estructura en capas
(`router → service → model/schema`). `health` es el único módulo del esqueleto.
No se crean carpetas vacías de módulos futuros.

*Alternativa:* capas globales (`routers/`, `services/`, `models/`) como en
ExpenseTrack. Se descarta: con muchos módulos de negocio, agrupar por tema
mantiene junto todo lo de "pedidos". Es la estructura aprobada en `CLAUDE.md`.

### 3. Configuración con `pydantic-settings` (fail fast)

Una clase `Settings` lee las variables y falla al importar si falta alguna
obligatoria, con un mensaje que nombra la variable (spec `local-environment`).
Se instancia una sola vez y se inyecta como dependencia de FastAPI para poder
sustituirla en los tests.

### 4. Base de datos: SQLAlchemy 2 síncrono + psycopg 3

Motor síncrono y sesión por petición mediante una dependencia de FastAPI.

*Alternativa:* SQLAlchemy asíncrono. Se descarta para el MVP: añade complejidad
(sesiones asíncronas en tests, *lazy loading*) sin necesidad a este volumen, y
FastAPI ejecuta las funciones síncronas en un pool de hilos.

El `MetaData` define una **convención de nombres** para índices y restricciones.
Sin ella, Alembic genera nombres aleatorios y los cambios futuros se vuelven
frágiles. Es barato ahora y caro después.

### 5. Migraciones: Alembic con una migración *baseline*

La primera revisión está vacía: solo crea la tabla `alembic_version`. Sirve para
probar el circuito completo (aplicar en base vacía, `down -v`, CI) sin inventar
tablas. El comando de arranque del backend es
`alembic upgrade head && uvicorn …`, de modo que una migración fallida impide
arrancar (spec `local-environment`).

### 6. Tests del backend sobre `voxel3d_test`

`conftest.py` se conecta a la base `postgres`, crea (o recrea) `<POSTGRES_DB>_test`,
la migra con Alembic una vez por sesión de tests y envuelve cada test en una
transacción con *rollback*. La prueba de "base de datos caída" sustituye la
dependencia de sesión por una que falla.

*Alternativa:* SQLite en memoria. Se descarta: PostgreSQL y SQLite se comportan
distinto (tipos, bloqueos de fila), y el inventario dependerá de los bloqueos de
PostgreSQL.

### 7. Endpoint `/api/v1/health`

Ejecuta `SELECT 1` y devuelve `200` o `503`. El cuerpo de error usa
`{"status", "database"}` (el formato de la spec) y no `{"detail"}`, porque es la
respuesta propia de un chequeo de salud, no un error de negocio. Nunca incluye la
cadena de conexión.

### 8. Frontend: Next.js (App Router) + TypeScript estricto + Tailwind

- Versiones estables más recientes en el momento de implementar, fijadas en
  `package-lock.json`.
- `output: "standalone"` para que la imagen de producción sea mínima.
- **TanStack Query** (decidido): un `QueryClientProvider` en un componente de
  cliente y un hook `useHealth` que pide `/health`. La portada
  (`HealthStatus`) usa el hook y dibuja los tres estados.
- Tailwind queda instalado con la configuración base; los **tokens de
  `DISENO.md` se añaden en `visual-identity`**.
- Estructura por *features*: `src/features/health/`, `src/components/` para
  piezas compartidas.

*Alternativa:* hacer el `fetch` en un componente de servidor. Se descarta para
este caso: el estado de conexión debe poder reintentarse en el navegador y es el
patrón que usarán el carrito y los filtros.

### 9. Tests del frontend: Vitest + React Testing Library

Se prueba el componente `HealthStatus` en los tres estados simulando `fetch`
(sin librerías extra). Cobertura con el proveedor integrado de Vitest.

### 10. Docker

Cada Dockerfile tiene etapas `base` → `dev` y `base` → `prod`:

- **Backend:** `python:3.12-slim`; `dev` con dependencias de desarrollo y recarga
  en caliente; `prod` solo con `requirements.txt` y sin recarga.
- **Frontend:** `node:22-alpine`; `dev` con `next dev`; `prod` con el resultado de
  `next build` (*standalone*) y solo las dependencias necesarias.
- Usuario no-root en todas las etapas finales.
- `.dockerignore` en `backend/` y `frontend/` (`.env`, `.git`, `__pycache__`,
  `node_modules`, `.next`).
- `docker-compose.yml`: `db` (PostgreSQL 16 con *healthcheck*), `mailhog`,
  `backend` y `frontend`, con `depends_on` por salud. Puertos de `db` y
  `mailhog` ligados a `127.0.0.1`.

### 11. Pre-commit

Como en ExpenseTrack: Ruff y los chequeos genéricos corren en el ordenador; mypy,
ESLint y Prettier corren **dentro de los contenedores** con
`docker compose exec`, porque en el ordenador no hay Node ni las dependencias del
backend. Más el hook de Conventional Commits.

*Alternativa:* instalar Node y un entorno virtual en el ordenador. Se descarta:
ya se eligió "todo en Docker" y mantiene el ordenador limpio.

### 12. CI en GitHub Actions

Tres trabajos en paralelo:

- **backend:** Ruff, formato, mypy, `pip-audit`, y pytest con cobertura ≥ 70% sobre
  un servicio PostgreSQL vacío (así también se prueba la instalación limpia).
- **frontend:** ESLint, Prettier, Vitest con cobertura ≥ 70% y `next build`.
- **docker:** construye ambas imágenes con `--target prod`.

Permisos mínimos (`contents: read`), acciones fijadas a su versión mayor y
Dependabot semanal para pip, npm, Docker y GitHub Actions. Todo valor secreto de
la CI es un dato de usar y tirar, nunca uno real.

### 13. Protección de `main`

Se activa **después** de que la CI haya pasado una vez (los nombres de los
trabajos tienen que existir). Exige Pull Request y los tres trabajos en verde,
con cero aprobaciones obligatorias (hay una sola persona) y sin permitir
saltarse las reglas ni a la administradora. Se configura con la API de GitHub
(`gh api`) y queda documentado en `BUENAS_PRACTICAS.md`.

### 14. Contrato OpenAPI

Un script exporta `backend/openapi.json` y un test compara el generado con el
versionado, como en ExpenseTrack. Cada endpoint declara resumen, descripción y
etiqueta en español.

## Risks / Trade-offs

- **Las versiones de Next.js y Tailwind cambian rápido** → se fijan con el
  *lockfile* y Dependabot propone las actualizaciones. Se verifica la
  documentación oficial de las versiones elegidas antes de configurar.
- **Los hooks necesitan el entorno levantado** (`docker compose up -d`) para poder
  hacer commit → se documenta en `BUENAS_PRACTICAS.md`. Es el mismo trato que en
  ExpenseTrack.
- **`NEXT_PUBLIC_*` se fija al construir la imagen** de producción, no al
  arrancarla → no afecta al esqueleto; hay que tenerlo presente en `deployment`.
- **Una migración *baseline* vacía parece que no hace nada** → se explica en el
  código y en la tarea; su valor es probar el circuito.
- **Primeras construcciones lentas** (imágenes y dependencias) → solo ocurre la
  primera vez; la CI usa caché.
- **La protección de rama estricta puede bloquear tu propio trabajo** si la CI se
  rompe → es el comportamiento deseado; en una urgencia se puede relajar desde
  los ajustes del repositorio.

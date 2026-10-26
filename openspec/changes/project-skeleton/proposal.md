# Proposal

## Why

Voxel3D todavía no tiene código. Antes de construir ninguna funcionalidad hace
falta un esqueleto mínimo que **arranque con un comando, se conecte a la base de
datos, pase un test y se compruebe solo en cada cambio**. Si el esqueleto falla,
es mucho más fácil arreglarlo con poco código que con meses de trabajo encima.

En ExpenseTrack, los hooks de calidad y la CI llegaron con más de un mes de
código, las migraciones no funcionaban en una instalación limpia y los tests
tocaban la base de desarrollo. Este change existe para que nada de eso se repita:
la calidad, las migraciones y el aislamiento de los tests se montan **desde el
primer día**.

## What Changes

- **Entorno local con Docker Compose**: `docker compose up --build` levanta base
  de datos (PostgreSQL), backend (FastAPI), frontend (Next.js) y una bandeja de
  email local (Mailhog). Las variables salen de un `.env` que nunca se sube a Git.
- **Backend mínimo** en monolito modular, con configuración validada al arrancar
  ("fail fast"), el nombre de la tienda leído de la configuración
  (`STORE_NAME`, nunca escrito en el código, para que el motor sirva como
  plantilla), conexión a la base de datos y un endpoint
  `GET /api/v1/health` que informa del estado del servidor y de la base de datos.
- **Base de datos y migraciones**: Alembic configurado, una migración inicial
  (*baseline*) que se aplica sola al arrancar el backend, y tests que usan su
  **propia base de datos**, recreada y migrada en cada ejecución.
- **Frontend mínimo** con Next.js, TypeScript en modo estricto y Tailwind, con
  TanStack Query, y una portada provisional que llama al backend y muestra si
  está conectado.
- **Imágenes Docker** con etapa de desarrollo y etapa final de **producción**
  (usuario no-root), aunque el despliegue llegue en otro change.
- **Calidad desde el principio**: Ruff, mypy, ESLint y Prettier; hooks de
  pre-commit con validación de Conventional Commits; CI en GitHub Actions
  (lint, formato, tipos, vulnerabilidades, tests con cobertura mínima del 70%,
  build y construcción de las imágenes); y Dependabot con las actualizaciones
  agrupadas (un Pull Request por tipo, no uno por librería).
- **Primeros tests**: pytest en el backend y Vitest en el frontend.
- **Contrato de la API** versionado en `backend/openapi.json`, con un test que
  falla si no está al día.
- **README inicial** en español, que presenta el proyecto como plantilla
  reutilizable de tiendas con Voxel3D como primera tienda, y actualización de `CLAUDE.md` con cómo se
  arranca el proyecto.
- **Protección de la rama `main`** en GitHub: solo se une código con Pull Request
  y CI en verde (se activa cuando la CI haya pasado una vez).

Fuera de alcance (cada cosa tiene su propio change):

- Usuarios, autenticación y roles (`users-auth-roles`).
- Modelos de negocio: productos, pedidos, carrito, etc.
- Identidad visual y componentes (`visual-identity`): aquí solo se deja Tailwind
  instalado, sin los colores ni las fuentes de `DISENO.md`.
- Tests de extremo a extremo con Playwright (llegan con el catálogo).
- Despliegue en internet y despliegue automático (`deployment`).
- Stripe y envío de emails reales.
- El resto de la configuración de la tienda (moneda, tarifa de envío, aviso
  "Modo demostración") y la guía "Cómo crear una tienda nueva" (al final del
  MVP, tras crear Sakuribella).

Este change incluye **backend y pantalla**, pero la pantalla es solo una portada
provisional para comprobar la conexión.

## Capabilities

### New Capabilities

- `local-environment`: cómo se arranca, se reinicia desde cero y se configura el
  proyecto en el ordenador de desarrollo, y cómo se aíslan sus datos y secretos.
- `service-health`: cómo informa la aplicación de que está viva y conectada a
  su base de datos, tanto por la API como en la portada.
- `quality-gates`: qué comprobaciones automáticas debe pasar cualquier cambio
  antes de entrar en la rama principal.

### Modified Capabilities

(ninguna: el proyecto aún no tiene specs.)

## Impact

- **Código nuevo**: `backend/`, `frontend/`, `docker-compose.yml`,
  `.dockerignore`, `.pre-commit-config.yaml`, `.github/workflows/ci.yml` y
  `.github/dependabot.yml`.
- **Documentación**: `README.md` nuevo; `CLAUDE.md` actualizado (estado y cómo
  se corre en local).
- **Dependencias principales**: FastAPI, SQLAlchemy, Alembic, Pydantic,
  psycopg, pytest, Ruff y mypy en Python; Next.js, React, TanStack Query,
  Tailwind, Vitest, ESLint y Prettier en Node.
- **Sistemas externos**: GitHub (CI, Dependabot y protección de rama). No hay
  servicios de pago ni de internet en la aplicación.
- **Requisito de la máquina de desarrollo**: solo Docker y Git; Node no hace
  falta en el ordenador.

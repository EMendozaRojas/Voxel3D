<h1 align="center">Voxel3D</h1>

<p align="center">
  Tienda online de artículos impresos en 3D, construida sobre un motor de tiendas reutilizable.
</p>

<p align="center">
  <a href="https://github.com/EMendozaRojas/Voxel3D/actions/workflows/ci.yml"><img src="https://github.com/EMendozaRojas/Voxel3D/actions/workflows/ci.yml/badge.svg?branch=main" alt="Estado de la CI"></a>
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white" alt="Python 3.12">
  <img src="https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white" alt="Next.js 16">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 16">
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker Compose">
  <img src="https://img.shields.io/badge/licencia-MIT-green" alt="Licencia MIT">
</p>

---

## ¿Qué es?

Voxel3D es una tienda online de figuras, lámparas, macetas y otros artículos
impresos en 3D con filamento. Se podrá comprar **como invitada** o con cuenta,
pagar con **Stripe** y seguir el estado del pedido; una administradora
gestionará el catálogo, el stock y los pedidos.

> **Modo demostración:** los pagos usan el modo de pruebas de Stripe. Nunca se
> mueve dinero real.

Es también un **proyecto de aprendizaje y de portafolio**, y una
**plantilla reutilizable de tiendas**: todo lo que cambia de una tienda a otra
(nombre, tema visual, categorías, filtros y variantes) va en la configuración
y en los datos, nunca en el código. El nombre de la tienda, por ejemplo, sale
de la variable `STORE_NAME`.

**Estado:** esqueleto técnico terminado. Base de datos, API, web, tests,
Docker, revisiones automáticas y CI funcionan de punta a punta; la tienda
todavía no vende. Ver la [hoja de ruta](#hoja-de-ruta).

### Un motor, varias tiendas

Al terminar el MVP, el motor se separará en su propio repositorio,
**Chasis**: como el chasis de un coche, es el mismo esqueleto con distinta
carrocería encima. Cada tienda es un repositorio "hijo" enlazado al padre, del
que recibe las mejoras.

```
                 Chasis (motor neutro)
     carrito · pagos · pedidos · panel · usuarios · filtros
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
      Voxel3D        Sakuribella     Tienda nueva
   (impresión 3D)  (bisutería kawaii)
```

## Tecnologías

| Parte | Herramientas |
|---|---|
| Backend | Python 3.12, FastAPI, SQLAlchemy 2, Alembic, Pydantic, PostgreSQL 16 |
| Frontend | Next.js 16 (App Router), React 19, TypeScript estricto, Tailwind CSS 4, TanStack Query |
| Tests | pytest, Vitest, React Testing Library |
| Calidad | Ruff, mypy, ESLint, Prettier, pre-commit, Conventional Commits |
| Entorno | Docker y Docker Compose (también para desarrollar: no hace falta instalar Python ni Node) |
| CI | GitHub Actions y Dependabot |

## Cómo arrancarlo

Solo necesitas **Git** y **Docker** (con Docker Compose).

```bash
git clone https://github.com/EMendozaRojas/Voxel3D.git
cd Voxel3D
cp .env.example .env
docker compose up --build
```

La primera vez tarda unos minutos (descarga las imágenes e instala las
librerías). Al arrancar, el backend aplica solo las migraciones de la base de
datos. Después:

| Qué | Dirección |
|---|---|
| Web | http://localhost:3000 (debe decir "Conectado") |
| Documentación de la API | http://localhost:8000/docs |
| Bandeja de correo de prueba (Mailpit) | http://localhost:8025 |

Todos los puertos escuchan solo en tu ordenador (`127.0.0.1`).

- **Parar:** `docker compose down` (los datos se conservan).
- **Empezar de cero:** `docker compose down -v` (borra también la base de
  datos).
- **Si un puerto está ocupado** (5432, 8000, 3000 u 8025), para el programa
  que lo usa antes de arrancar.

El archivo `.env` guarda las contraseñas y la configuración local: **nunca se
sube a git**. `.env.example` es la plantilla sin secretos.

## Tests y calidad

Con el proyecto arrancado (`docker compose up -d`):

```bash
# Backend: tests con cobertura (mínimo 70%), lint, formato y tipos
docker compose exec backend pytest --cov
docker compose exec backend ruff check .
docker compose exec backend ruff format --check .
docker compose exec backend mypy app tests scripts

# Frontend: tests con cobertura (mínimo 70%), lint y formato
docker compose exec frontend npm run test:coverage
docker compose exec frontend npm run lint
docker compose exec frontend npm run format:check
```

Los tests del backend usan su propia base de datos (`<POSTGRES_DB>_test`),
que se crea y se migra desde cero en cada ejecución: nunca tocan los datos de
desarrollo.

**Revisiones antes de cada commit.** Con [pre-commit](https://pre-commit.com/)
instalado (por ejemplo, `sudo apt install pre-commit`):

```bash
pre-commit install --hook-type pre-commit --hook-type commit-msg
```

Desde entonces, cada commit pasa Ruff, mypy, ESLint, Prettier y otros
chequeos, y su mensaje debe seguir
[Conventional Commits](https://www.conventionalcommits.org/es/) (`feat: ...`,
`fix: ...`). mypy, ESLint y Prettier corren dentro de los contenedores, así que
el proyecto tiene que estar arrancado.

**CI.** En cada push y pull request, GitHub Actions repite todo lo anterior,
revisa vulnerabilidades (`pip-audit` y `npm audit`) y construye las imágenes
de producción. Dependabot propone cada semana las actualizaciones, agrupadas.

## Estructura

```
Voxel3D/
├── backend/              # API (FastAPI)
│   ├── app/core/         # configuración, base de datos, metadatos de la API
│   ├── app/modules/      # un módulo por tema (de momento, health)
│   ├── alembic/          # migraciones de la base de datos
│   ├── tests/
│   └── openapi.json      # contrato de la API, comprobado por un test
├── frontend/             # web (Next.js)
│   └── src/
│       ├── app/          # páginas
│       ├── features/     # una carpeta por funcionalidad (de momento, health)
│       └── components/   # piezas compartidas
├── openspec/             # especificaciones y planes de cada cambio
├── .github/              # CI y Dependabot
└── docker-compose.yml
```

## Cómo se trabaja en este proyecto

Voxel3D es un proyecto de **desarrollo asistido por IA** hecho con método:

1. **Primero la especificación.** Cada funcionalidad se planifica como un
   *change* de [OpenSpec](https://github.com/Fission-AI/OpenSpec), en
   [`openspec/`](openspec/): por qué se hace, cómo, sus escenarios y sus
   tareas. El diseño visual también se decide antes de programar.
2. **Después el código, con ayuda de un asistente de IA** (Claude Code), tarea
   a tarea y en una rama propia. Las reglas del proyecto están en
   [`CLAUDE.md`](CLAUDE.md) y [`BUENAS_PRACTICAS.md`](BUENAS_PRACTICAS.md).
3. **Siempre con tests.** Cada escenario de la especificación tiene un test que
   comprueba un resultado concreto. La cobertura mínima (70%) es un suelo, no el
   objetivo.
4. **Revisión automática.** pre-commit y la CI deben pasar antes de unir nada a
   `main`.

## Hoja de ruta

- [x] **Esqueleto técnico:** Docker Compose, base de datos con migraciones,
      API con `/health` documentada, web conectada, tests, pre-commit, CI y
      Dependabot
- [ ] **Identidad visual:** tema en un único archivo, logo y componentes base
- [ ] **Usuarios y roles:** registro, inicio de sesión y administradora
- [ ] **Catálogo:** categorías, atributos, productos, variantes e imágenes
- [ ] **Carrito** en el servidor, también para invitadas
- [ ] **Compra como invitada:** dirección y envío con tarifa fija
- [ ] **Pagos con Stripe** (modo de pruebas) y webhooks
- [ ] **Pedidos:** estados y panel de gestión
- [ ] **Inventario:** reserva de stock al pagar, historial y avisos de stock bajo
- [ ] **Cuenta:** perfil, libreta de direcciones e historial de pedidos
- [ ] **Despliegue** con URL pública
- [ ] **Chasis:** separar el motor neutro en su propio repositorio
- [ ] **Sakuribella:** segunda tienda, para validar la plantilla

## Licencia

[MIT](LICENSE).

# Tasks

## 1. Entorno base y backend mínimo

- [x] 1.1 Crear `backend/` con `requirements.txt` y `requirements-dev.txt` (versiones fijadas), `pyproject.toml` (Ruff, mypy estricto, pytest y cobertura mínima del 70%) y `backend/.dockerignore`; verificar que los archivos existen y que la instalación de dependencias de la tarea 1.2 termina sin errores
- [x] 1.2 Escribir `backend/Dockerfile` con etapas `base`, `dev` y `prod` y usuario no-root; verificar que `docker build --target dev` y `--target prod` terminan sin errores y que `docker run --rm <imagen> id -u` no devuelve `0`
- [x] 1.3 Crear `docker-compose.yml` con `db` (PostgreSQL 16, *healthcheck*) y `mailpit`, ambos con puertos en `127.0.0.1`, y copiar `.env.example` a `.env`; verificar que `docker compose up -d db mailpit` deja la base de datos en estado `healthy` y la bandeja responde en `http://localhost:8025`
- [x] 1.4 Crear `app/core/config.py` (`Settings` con `pydantic-settings`, obligatorias validadas al importar, entre ellas `STORE_NAME`) y añadir `STORE_NAME=Voxel3D` a `.env.example`; verificar con un test que, sin `DATABASE_URL`, el error nombra la variable que falta, y que `grep -rn "Voxel3D" backend/app` no encuentra nada
- [x] 1.5 Crear `app/core/db.py` (motor, sesión por petición y `MetaData` con convención de nombres); verificar con un test que la sesión ejecuta `SELECT 1` contra PostgreSQL y que una restricción creada recibe el nombre de la convención

## 2. Migraciones y base de datos de tests

- [x] 2.1 Configurar Alembic (`alembic.ini`, `env.py` leyendo `Settings` y `MetaData`) y crear la migración *baseline* vacía; verificar que `alembic upgrade head` sobre una base vacía crea `alembic_version` y que `alembic downgrade base` también funciona
- [x] 2.2 Añadir el servicio `backend` a `docker-compose.yml` con el comando `alembic upgrade head && uvicorn …` y dependencia de la salud de `db`; verificar que `docker compose down -v && docker compose up --build` deja el backend en marcha, y que una migración rota a propósito impide que arranque y deja el error en `docker compose logs backend` (revertir la rotura después)
- [x] 2.3 Escribir `tests/conftest.py` con la base `<POSTGRES_DB>_test` creada y migrada en cada ejecución y cada test en una transacción con *rollback*; verificar que `docker compose exec backend pytest` pasa, que `psql -l` muestra la base de tests y que la base de desarrollo no cambia

## 3. Endpoint de estado y documentación de la API

- [x] 3.1 Crear el módulo `modules/health` con `GET /api/v1/health` (`SELECT 1`, `200` / `503`, sin datos de conexión en la respuesta); verificar con tests de `200 {"status":"ok","database":"ok"}`, de `503` con la base caída y de que el cuerpo del `503` no contiene la URL de conexión
- [x] 3.2 Configurar CORS con los orígenes de `BACKEND_CORS_ORIGINS`; verificar con tests que `http://localhost:3000` recibe las cabeceras de permiso y que un origen no configurado no las recibe
- [x] 3.3 Añadir metadatos OpenAPI en español (título a partir de `STORE_NAME`, descripción, etiqueta, resumen y errores) y un script `scripts/export_openapi` que genera `backend/openapi.json`; verificar con un test que falla si el archivo versionado no coincide con el generado, que el endpoint aparece en `/docs` con resumen y etiqueta en español, y con un test que el título cambia al cambiar `STORE_NAME`

## 4. Frontend mínimo

- [x] 4.1 Crear `frontend/` con Next.js (App Router), TypeScript en modo `strict` y Tailwind, generado sin instalar Node en el ordenador (dentro de un contenedor de `node:22-alpine`), y añadir `frontend/.dockerignore`; verificar que existen `package.json` y `package-lock.json` y que `npm run build` termina sin errores dentro del contenedor
- [x] 4.2 Configurar ESLint y Prettier con los *scripts* `lint`, `format` y `format:check`; verificar que `npm run lint` y `npm run format:check` pasan sobre el código generado
- [x] 4.3 Añadir TanStack Query (`QueryClientProvider`), el hook `useHealth` y el componente `HealthStatus` con los estados cargando, conectado y error con botón de reintento, y usarlo en la portada con un título genérico ("Estado del servidor", sin nombre de tienda); verificar con tests de Vitest y React Testing Library que se muestran los tres estados con `fetch` simulado y que el botón de reintento vuelve a pedir el estado
- [x] 4.4 Configurar Vitest con cobertura y el *script* `test:coverage`; verificar que `npm run test:coverage` pasa con cobertura de al menos 70%
- [x] 4.5 Escribir `frontend/Dockerfile` con etapas `base`, `dev` y `prod` (`output: "standalone"`, usuario no-root) y añadir el servicio `frontend` a `docker-compose.yml`; verificar que `docker build --target prod` termina sin errores y que `docker run --rm <imagen> id -u` no devuelve `0`

## 5. Arranque completo desde cero

- [x] 5.1 Probar el arranque completo con `docker compose down -v && docker compose up --build`; verificar que la portada en `http://localhost:3000` muestra "conectado", que `http://localhost:8000/docs` carga y que `http://localhost:8000/api/v1/health` devuelve `200`
- [x] 5.2 Comprobar los puertos y los secretos; verificar que los puertos de PostgreSQL y de Mailpit solo escuchan en `127.0.0.1` (`docker compose ps` o `ss -ltn`), que `git check-ignore .env` confirma que se ignora y que `docker run --rm <imagen> ls -a /app` no muestra ningún `.env`

## 6. Calidad automática

- [x] 6.1 Crear `.pre-commit-config.yaml` (chequeos genéricos, Ruff, mypy, ESLint y Prettier en contenedor, y Conventional Commits) e instalarlo con `pre-commit install --hook-type pre-commit --hook-type commit-msg`; verificar que `pre-commit run --all-files` pasa, que un mensaje como "arreglos varios" se rechaza y que un archivo con mal formato se rechaza
- [x] 6.2 Crear `.github/workflows/ci.yml` con los trabajos `backend` (Ruff, formato, mypy, `pip-audit`, pytest con PostgreSQL vacío y cobertura ≥ 70%), `frontend` (ESLint, Prettier, Vitest con cobertura y `next build`) y `docker` (construcción de ambas imágenes con `--target prod`); verificar que el YAML es válido (`pre-commit` con `check-yaml`) y que la ejecución en GitHub termina en verde (tarea 8.1)
- [ ] 6.3 Crear `.github/dependabot.yml` con revisión semanal de `pip`, `npm`, `docker` y `github-actions`, con las actualizaciones agrupadas (`groups`: un Pull Request por ecosistema); verificar que el YAML es válido y que Dependabot aparece activo en la configuración del repositorio

## 7. Documentación

- [ ] 7.1 Escribir `README.md` en español (qué es: plantilla reutilizable de tiendas con Voxel3D como primera tienda; estado, tecnologías, cómo arrancarlo, cómo correr los tests); verificar siguiendo el README, paso a paso, desde un clon limpio
- [ ] 7.2 Actualizar `CLAUDE.md` (estado, "Cómo se corre en local" y estructura real de carpetas) y añadir a `BUENAS_PRACTICAS.md` la protección de `main`; verificar que los comandos y rutas citados existen y funcionan

## 8. Integración final

- [ ] 8.1 Subir la rama `feat/project-skeleton` y abrir su Pull Request (con tu confirmación); verificar que los tres trabajos de la CI terminan en verde
- [ ] 8.2 Unir el Pull Request a `main` (con tu confirmación) y actualizar `main` en local; verificar que `git log --oneline` en `main` muestra los tres commits del patrón (plan, código y archivo)
- [ ] 8.3 Activar la protección de `main` con `gh api` (Pull Request y los tres trabajos obligatorios, sin saltos para nadie, con tu confirmación); verificar que `gh api repos/EMendozaRojas/Voxel3D/branches/main/protection` muestra las reglas y que un push directo a `main` es rechazado
- [ ] 8.4 Clonar el repositorio en una carpeta temporal y seguir el README; verificar que la aplicación arranca y la portada muestra "conectado"

## Workflow follow-up

- Archivar el change (`/opsx:archive`): las tres specs pasan a `openspec/specs/`.
- Actualizar `CLAUDE.md` si algo del esqueleto real difiere de lo previsto.

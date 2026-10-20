# Spec Delta

## Purpose

Define cómo se arranca, se reinicia desde cero y se configura Voxel3D en el
ordenador de desarrollo, y cómo se protegen sus secretos y se aíslan sus datos.

## ADDED Requirements

### Requirement: Arranque con un solo comando
El sistema SHALL poder arrancarse completo en local con `docker compose up --build`, a partir de un archivo `.env` copiado de `.env.example`, sin instalar nada más que Docker en el ordenador.

#### Scenario: Arranque correcto
- **WHEN** la persona copia `.env.example` a `.env` y ejecuta `docker compose up --build`
- **THEN** arrancan la base de datos, el backend, el frontend y la bandeja de email local
- **AND** el frontend responde en `http://localhost:3000`, la documentación de la API en `http://localhost:8000/docs` y la bandeja de email en `http://localhost:8025`

### Requirement: Instalación limpia funcional
El sistema SHALL arrancar correctamente desde cero, incluida una base de datos vacía, y aplicar las migraciones pendientes antes de aceptar peticiones.

#### Scenario: Reinicio desde cero
- **WHEN** la persona ejecuta `docker compose down -v` y después `docker compose up --build`
- **THEN** el backend aplica todas las migraciones sobre la base de datos vacía y llega a estado saludable

#### Scenario: Una migración falla
- **WHEN** una migración pendiente produce un error
- **THEN** el backend no arranca
- **AND** el error es visible en `docker compose logs backend`

### Requirement: Configuración validada al arrancar
El sistema SHALL validar sus variables de entorno obligatorias al arrancar y negarse a iniciar si falta alguna.

#### Scenario: Falta una variable obligatoria
- **WHEN** el backend arranca sin una variable obligatoria, por ejemplo `DATABASE_URL`
- **THEN** el proceso termina con un mensaje que nombra la variable que falta
- **AND** no queda escuchando peticiones

### Requirement: Secretos fuera del repositorio y de las imágenes
El sistema SHALL mantener los secretos fuera del control de versiones y de las imágenes Docker: el archivo `.env` no se versiona ni se copia dentro de ninguna imagen, y el repositorio incluye un `.env.example` solo con valores de ejemplo.

#### Scenario: Archivo .env ignorado
- **WHEN** existe un archivo `.env` con valores reales
- **THEN** Git lo ignora
- **AND** `.env.example` sigue siendo un archivo versionado sin valores reales

#### Scenario: Imágenes sin secretos
- **WHEN** se construye cualquier imagen del proyecto
- **THEN** la imagen no contiene el archivo `.env`

### Requirement: Servicios internos accesibles solo desde la máquina local
El sistema SHALL exponer la base de datos y la bandeja de email únicamente en la interfaz local (`127.0.0.1`) y la bandeja de email SHALL NOT entregar mensajes a internet.

#### Scenario: Puertos internos no expuestos a la red
- **WHEN** el entorno está en marcha
- **THEN** los puertos de la base de datos y de Mailhog solo escuchan en `127.0.0.1`

### Requirement: Contenedores sin privilegios de administrador
El sistema SHALL ejecutar los procesos del backend y del frontend con un usuario que no sea administrador (no-root) dentro de sus contenedores.

#### Scenario: Usuario del proceso
- **WHEN** el backend o el frontend están en ejecución
- **THEN** su proceso corre con un usuario distinto de `root`

### Requirement: Imágenes de producción construibles
El sistema SHALL poder construir imágenes mínimas de producción del backend y del frontend, separadas de las de desarrollo.

#### Scenario: Construcción de la etapa de producción
- **WHEN** se construye cada imagen con la etapa `prod`
- **THEN** la construcción termina sin errores
- **AND** la imagen resultante no incluye las dependencias de desarrollo

### Requirement: Tests aislados de los datos de desarrollo
El sistema SHALL ejecutar sus tests de backend sobre una base de datos propia, creada y migrada desde cero en cada ejecución, de modo que nunca lea ni modifique los datos de desarrollo.

#### Scenario: Ejecución de los tests
- **WHEN** se ejecutan los tests del backend
- **THEN** usan una base de datos distinta de la de desarrollo, que se crea y se migra al empezar
- **AND** los datos de la base de desarrollo permanecen intactos

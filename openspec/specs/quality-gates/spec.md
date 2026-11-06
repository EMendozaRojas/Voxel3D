# quality-gates Specification

## Purpose

Define las comprobaciones automáticas que cualquier cambio debe pasar antes de
entrar en la rama principal, para que la calidad no dependa de la memoria de
nadie.

## Requirements

### Requirement: Comprobaciones antes de cada commit
El sistema SHALL ejecutar automáticamente, antes de cada commit, comprobaciones de formato y de calidad del código, y SHALL rechazar el commit si alguna falla.

#### Scenario: Código con errores de estilo
- **WHEN** se intenta hacer un commit con código que incumple las reglas de formato o de lint
- **THEN** el commit se rechaza
- **AND** se indica qué comprobación falló

#### Scenario: Secretos y archivos peligrosos
- **WHEN** se intenta hacer un commit que incluye una clave privada o un archivo demasiado grande
- **THEN** el commit se rechaza

### Requirement: Mensajes de commit con Conventional Commits
El sistema SHALL rechazar los commits cuyo mensaje no siga el formato Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`).

#### Scenario: Mensaje inválido
- **WHEN** se intenta hacer un commit con el mensaje "arreglos varios"
- **THEN** el commit se rechaza explicando el formato esperado

#### Scenario: Mensaje válido
- **WHEN** se hace un commit con el mensaje "feat: añade el endpoint de estado"
- **THEN** el commit se acepta

### Requirement: Integración continua en cada cambio
El sistema SHALL ejecutar en GitHub, en cada Pull Request y en cada push a `main`, las comprobaciones de lint, formato, tipos, vulnerabilidades en dependencias, tests con cobertura y construcción tanto del backend como del frontend.

#### Scenario: Todo correcto
- **WHEN** se sube un cambio que cumple todas las comprobaciones
- **THEN** la ejecución termina en verde

#### Scenario: Una comprobación falla
- **WHEN** se sube un cambio en el que falla cualquier comprobación
- **THEN** la ejecución termina en rojo indicando cuál falló

### Requirement: Cobertura mínima de tests
El sistema SHALL fallar la integración continua si la cobertura de tests del backend o del frontend baja del 70%.

#### Scenario: Cobertura insuficiente
- **WHEN** un cambio deja la cobertura del backend por debajo del 70%
- **THEN** la ejecución termina en rojo indicando el porcentaje alcanzado

### Requirement: Arranque desde cero comprobado en cada cambio
El sistema SHALL comprobar en cada ejecución de integración continua que las migraciones se aplican sobre una base de datos vacía y que las imágenes de producción se construyen.

#### Scenario: Migraciones rotas
- **WHEN** un cambio introduce una migración que falla sobre una base de datos vacía
- **THEN** la integración continua termina en rojo

#### Scenario: Imagen de producción rota
- **WHEN** un cambio impide construir una imagen de producción
- **THEN** la integración continua termina en rojo

### Requirement: Dependencias vigiladas
El sistema SHALL revisar semanalmente las dependencias de Python, de Node, de Docker y de las acciones de GitHub, y proponer su actualización mediante Pull Requests agrupados por ecosistema. Las versiones que son decisiones del proyecto (la versión mayor de PostgreSQL y de Node, y la versión de Python) MUST NOT proponerse automáticamente: se actualizan a mano junto con la CI y la configuración.

#### Scenario: Dependencia desactualizada
- **WHEN** existe una versión nueva de una dependencia declarada en el proyecto
- **THEN** se abre automáticamente un Pull Request con la actualización, agrupada con las demás del mismo ecosistema

#### Scenario: Versión que es una decisión del proyecto
- **WHEN** sale una versión mayor nueva de PostgreSQL
- **THEN** no se abre ningún Pull Request automático para ella

### Requirement: Rama principal protegida
El sistema SHALL impedir que se una código a `main` sin un Pull Request y sin que las comprobaciones de integración continua estén en verde.

#### Scenario: Intento de subir directamente a main
- **WHEN** alguien intenta subir un commit directamente a `main`
- **THEN** GitHub lo rechaza

#### Scenario: Pull Request con la CI en rojo
- **WHEN** un Pull Request tiene comprobaciones fallidas
- **THEN** GitHub no permite unirlo a `main`

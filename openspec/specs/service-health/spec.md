# service-health Specification

## Purpose

Define cómo informa Voxel3D de que está en marcha y conectado a su base de
datos, tanto a través de la API como en la portada de la aplicación.

## Requirements

### Requirement: Endpoint de estado de la API
El sistema SHALL ofrecer `GET /api/v1/health`, sin autenticación, que informa del estado del servidor y de su conexión con la base de datos.

#### Scenario: Todo funciona
- **WHEN** se llama a `GET /api/v1/health` y la base de datos responde
- **THEN** la respuesta es `200` con `{"status": "ok", "database": "ok"}`

#### Scenario: La base de datos no responde
- **WHEN** se llama a `GET /api/v1/health` y la base de datos no es alcanzable
- **THEN** la respuesta es `503` con `{"status": "error", "database": "unavailable"}`
- **AND** la respuesta no revela la dirección ni las credenciales de la base de datos

### Requirement: Portada con el estado de conexión
El sistema SHALL mostrar en la portada, en español, si el frontend puede comunicarse con la API, con un estado distinto para cargando, conectado y error.

#### Scenario: Conectado
- **WHEN** la persona abre la portada y la API responde con estado correcto
- **THEN** la portada muestra que el servidor está conectado

#### Scenario: Sin conexión
- **WHEN** la persona abre la portada y la API no responde o devuelve error
- **THEN** la portada muestra un mensaje de error comprensible
- **AND** ofrece un botón para reintentar

#### Scenario: Cargando
- **WHEN** la portada está esperando la respuesta de la API
- **THEN** muestra un estado de carga

### Requirement: Documentación de la API en español
El sistema SHALL publicar la documentación de la API en `/docs`, escrita en español, con un resumen, una descripción y una etiqueta para cada endpoint, y SHALL versionar su contrato en `backend/openapi.json`.

#### Scenario: Endpoint documentado
- **WHEN** se abre `http://localhost:8000/docs`
- **THEN** el endpoint de estado aparece con resumen, descripción y etiqueta en español

#### Scenario: Nombre de la tienda desde la configuración
- **WHEN** se abre `http://localhost:8000/docs` con `STORE_NAME=Voxel3D` en la configuración
- **THEN** el título de la documentación usa el nombre "Voxel3D", sin que esté escrito en el código

#### Scenario: Contrato desactualizado
- **WHEN** un endpoint o esquema cambia y `backend/openapi.json` no se ha regenerado
- **THEN** un test falla indicando que el contrato está desactualizado

### Requirement: Comunicación permitida solo desde el frontend
El sistema SHALL aceptar peticiones del navegador solo desde los orígenes configurados para el frontend.

#### Scenario: Origen permitido
- **WHEN** el navegador llama a la API desde `http://localhost:3000`
- **THEN** la respuesta incluye las cabeceras que permiten la llamada

#### Scenario: Origen no permitido
- **WHEN** el navegador llama a la API desde un origen no configurado
- **THEN** la respuesta no incluye las cabeceras que permiten la llamada

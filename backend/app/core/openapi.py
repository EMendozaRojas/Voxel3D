"""Metadatos de la documentación OpenAPI (`/docs`, `/redoc`, `openapi.json`).

Concentra lo que no pertenece a un router concreto: el título, la
introducción de la API y los grupos (tags). Son textos del motor: el nombre
de la tienda llega siempre desde la configuración (`STORE_NAME`).
"""

from enum import StrEnum
from typing import Any

API_VERSION = "0.1.0"

API_DESCRIPTION = """
API REST de la tienda online: catálogo, carrito, pedidos, pagos e inventario.

## Convenciones

- Todas las rutas cuelgan de `/api/v1`.
- Textos y mensajes en español.
"""


def api_title(store_name: str) -> str:
    return f"API de {store_name}"


class Tag(StrEnum):
    HEALTH = "Estado"


OPENAPI_TAGS: list[dict[str, Any]] = [
    {
        "name": Tag.HEALTH,
        "description": "Comprobar que el servidor está en marcha y conectado a la base de datos.",
    },
]

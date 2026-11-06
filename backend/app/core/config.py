from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Ajustes leídos de variables de entorno (las pone docker-compose desde `.env`).

    Los campos sin valor por defecto son obligatorios: si falta alguno, la
    validación falla al importar este módulo y el backend no llega a arrancar.
    """

    # Nombre de la tienda. El motor nunca lo escribe en el código: así sirve
    # como plantilla para otras tiendas.
    store_name: str
    database_url: str
    backend_cors_origins: str = "http://localhost:3000"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",")]


@lru_cache
def get_settings() -> Settings:
    return Settings()


# Fail fast: se valida al importar, no en la primera petición.
get_settings()

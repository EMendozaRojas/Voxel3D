from collections.abc import Generator

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.main import app

# Base de datos que no existe, con usuario y contraseña inventados que la
# respuesta nunca debe mostrar.
URL_CAIDA = "postgresql+psycopg://usuario_secreto:clave_secreta@db-que-no-existe:5432/tienda"


def test_health_responde_ok_con_la_base_de_datos_en_marcha(client: TestClient) -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "ok"}


def test_health_responde_503_sin_revelar_la_conexion_si_la_base_no_responde() -> None:
    engine_caido = create_engine(URL_CAIDA, connect_args={"connect_timeout": 2})

    def get_db_caida() -> Generator[Session, None, None]:
        with Session(engine_caido) as session:
            yield session

    app.dependency_overrides[get_db] = get_db_caida
    try:
        with TestClient(app) as client:
            response = client.get("/api/v1/health")
    finally:
        app.dependency_overrides.clear()
        engine_caido.dispose()

    assert response.status_code == 503
    assert response.json() == {"status": "error", "database": "unavailable"}
    for dato_privado in ("usuario_secreto", "clave_secreta", "db-que-no-existe", "5432"):
        assert dato_privado not in response.text

import pytest
from fastapi.testclient import TestClient

FRONTEND = "http://localhost:3000"
OTRA_WEB = "http://web-desconocida.test"


def test_el_frontend_configurado_puede_llamar_a_la_api(client: TestClient) -> None:
    response = client.get("/api/v1/health", headers={"Origin": FRONTEND})

    assert response.headers["access-control-allow-origin"] == FRONTEND


def test_el_navegador_puede_preguntar_antes_desde_el_frontend(client: TestClient) -> None:
    # Petición previa (preflight) que el navegador hace antes de algunas llamadas
    response = client.options(
        "/api/v1/health",
        headers={"Origin": FRONTEND, "Access-Control-Request-Method": "GET"},
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == FRONTEND


@pytest.mark.parametrize("method", ["GET", "OPTIONS"])
def test_un_origen_no_configurado_no_recibe_permiso(client: TestClient, method: str) -> None:
    response = client.request(
        method,
        "/api/v1/health",
        headers={"Origin": OTRA_WEB, "Access-Control-Request-Method": "GET"},
    )

    assert "access-control-allow-origin" not in response.headers

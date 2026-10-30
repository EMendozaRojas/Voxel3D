import json
import os
import subprocess
import sys
from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app
from scripts.export_openapi import OPENAPI_PATH, render

BACKEND_DIR = Path(__file__).resolve().parent.parent
REGENERATE = "docker compose exec backend python -m scripts.export_openapi"


def test_openapi_json_esta_al_dia() -> None:
    assert OPENAPI_PATH.exists(), f"Falta {OPENAPI_PATH.name}. Genéralo con: {REGENERATE}"
    guardado = json.loads(OPENAPI_PATH.read_text(encoding="utf-8"))
    assert guardado == app.openapi(), (
        f"{OPENAPI_PATH.name} está desactualizado. Regenéralo con: {REGENERATE}"
    )


def test_la_exportacion_es_estable() -> None:
    assert render(app.openapi()) == render(app.openapi())


def test_el_endpoint_de_estado_esta_documentado_en_espanol(client: TestClient) -> None:
    documento = client.get("/openapi.json").json()
    operacion = documento["paths"]["/api/v1/health"]["get"]

    assert operacion["tags"] == ["Estado"]
    assert operacion["summary"] == "Comprobar el estado del servidor"
    assert operacion["description"]
    assert "503" in operacion["responses"]
    assert client.get("/docs").status_code == 200


def test_el_titulo_sale_del_nombre_de_la_tienda() -> None:
    env = {**os.environ, "STORE_NAME": "Sakuribella"}

    result = subprocess.run(
        [sys.executable, "-c", "from app.main import app; print(app.title)"],
        cwd=BACKEND_DIR,
        env=env,
        capture_output=True,
        text=True,
        check=True,
    )

    assert result.stdout.strip() == "API de Sakuribella"

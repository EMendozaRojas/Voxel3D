import os
import subprocess
import sys
from pathlib import Path

import pytest

from app.core.config import Settings

BACKEND_DIR = Path(__file__).resolve().parent.parent


def test_lee_las_variables_de_entorno(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("STORE_NAME", "Tienda de prueba")
    monkeypatch.setenv("DATABASE_URL", "postgresql+psycopg://u:p@db:5432/x")
    monkeypatch.setenv("BACKEND_CORS_ORIGINS", "http://a.test, http://b.test")

    settings = Settings()

    assert settings.store_name == "Tienda de prueba"
    assert settings.cors_origins == ["http://a.test", "http://b.test"]


def test_sin_database_url_el_backend_no_arranca() -> None:
    env = {k: v for k, v in os.environ.items() if k != "DATABASE_URL"}
    env["STORE_NAME"] = "Tienda de prueba"

    result = subprocess.run(
        [sys.executable, "-c", "import app.core.config"],
        cwd=BACKEND_DIR,
        env=env,
        capture_output=True,
        text=True,
    )

    assert result.returncode != 0
    assert "database_url" in result.stderr.lower()

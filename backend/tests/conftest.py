import os
from collections.abc import Generator
from pathlib import Path

from sqlalchemy.engine import make_url

# Aislamiento: antes de importar nada de `app` (que lee la configuración una
# sola vez), los tests pasan a su propia base `<nombre>_test`. Así nunca leen
# ni modifican los datos de desarrollo.
_test_url = make_url(os.environ["DATABASE_URL"])
if not (_test_url.database or "").endswith("_test"):
    _test_url = _test_url.set(database=f"{_test_url.database}_test")
os.environ["DATABASE_URL"] = _test_url.render_as_string(hide_password=False)

import pytest  # noqa: E402
from alembic import command  # noqa: E402
from alembic.config import Config  # noqa: E402
from sqlalchemy import create_engine, text  # noqa: E402
from sqlalchemy.orm import Session  # noqa: E402

from app.core.db import engine  # noqa: E402

ALEMBIC_INI = Path(__file__).resolve().parents[1] / "alembic.ini"


@pytest.fixture(scope="session", autouse=True)
def test_database() -> None:
    """Recrea la base de tests desde cero y la migra a la última revisión.

    Así cada ejecución parte de un estado conocido y, de paso, comprueba otra
    vez que las migraciones funcionan sobre una base vacía.
    """
    name = _test_url.database
    # Red de seguridad: este fixture borra la base, nunca debe ser la de desarrollo.
    assert name and name.endswith("_test"), f"Base de tests sin sufijo _test: {name}"

    engine.dispose()
    admin = create_engine(_test_url.set(database="postgres"), isolation_level="AUTOCOMMIT")
    with admin.connect() as conn:
        conn.execute(text(f'DROP DATABASE IF EXISTS "{name}" WITH (FORCE)'))
        conn.execute(text(f'CREATE DATABASE "{name}"'))
    admin.dispose()

    command.upgrade(Config(str(ALEMBIC_INI)), "head")


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    """Sesión dentro de una transacción que se deshace al acabar el test.

    Con `create_savepoint`, un `commit()` del código probado solo cierra un
    punto de guardado: la transacción de fuera sigue abierta y el rollback
    final borra todo lo que hizo el test.
    """
    with engine.connect() as connection:
        transaction = connection.begin()
        session = Session(bind=connection, join_transaction_mode="create_savepoint")
        try:
            yield session
        finally:
            session.close()
            transaction.rollback()

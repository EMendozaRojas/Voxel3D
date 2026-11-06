from sqlalchemy import Column, Integer, String, Table, UniqueConstraint, inspect, text
from sqlalchemy.orm import Session

from app.core.db import Base, get_db


def test_la_sesion_ejecuta_select_1_contra_postgresql() -> None:
    db = next(get_db())
    try:
        assert db.execute(text("SELECT 1")).scalar_one() == 1
    finally:
        db.close()


def test_los_tests_usan_la_base_de_tests_migrada() -> None:
    db = next(get_db())
    try:
        assert db.execute(text("SELECT current_database()")).scalar_one().endswith("_test")
        assert db.execute(text("SELECT count(*) FROM alembic_version")).scalar_one() == 1
    finally:
        db.close()


def test_las_restricciones_reciben_el_nombre_de_la_convencion(db_session: Session) -> None:
    tabla = Table(
        "prueba_convencion",
        Base.metadata,
        Column("id", Integer, primary_key=True),
        Column("email", String(100)),
        UniqueConstraint("email"),
    )
    try:
        # En PostgreSQL crear una tabla también se deshace con el rollback de
        # db_session: la prueba no deja nada en la base de datos.
        conn = db_session.connection()
        tabla.create(conn)
        inspector = inspect(conn)
        unicas = inspector.get_unique_constraints("prueba_convencion")
        clave = inspector.get_pk_constraint("prueba_convencion")
    finally:
        Base.metadata.remove(tabla)

    assert [u["name"] for u in unicas] == ["uq_prueba_convencion_email"]
    assert clave["name"] == "pk_prueba_convencion"

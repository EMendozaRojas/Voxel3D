from sqlalchemy import Column, Integer, String, Table, UniqueConstraint, inspect, text

from app.core.db import Base, engine, get_db


def test_la_sesion_ejecuta_select_1_contra_postgresql() -> None:
    db = next(get_db())
    try:
        assert db.execute(text("SELECT 1")).scalar_one() == 1
    finally:
        db.close()


def test_las_restricciones_reciben_el_nombre_de_la_convencion() -> None:
    tabla = Table(
        "prueba_convencion",
        Base.metadata,
        Column("id", Integer, primary_key=True),
        Column("email", String(100)),
        UniqueConstraint("email"),
    )
    try:
        # En PostgreSQL crear una tabla también se deshace con rollback:
        # la prueba no deja nada en la base de datos.
        with engine.connect() as conn, conn.begin() as trans:
            tabla.create(conn)
            inspector = inspect(conn)
            unicas = inspector.get_unique_constraints("prueba_convencion")
            clave = inspector.get_pk_constraint("prueba_convencion")
            trans.rollback()
    finally:
        Base.metadata.remove(tabla)

    assert [u["name"] for u in unicas] == ["uq_prueba_convencion_email"]
    assert clave["name"] == "pk_prueba_convencion"

"""baseline vacía

Primera página del historial de migraciones. No crea tablas: sirve para probar
el circuito completo (aplicar en una base vacía, deshacer, CI). Las tablas de la
tienda llegarán en sus propias migraciones, encadenadas a partir de esta.

Revision ID: a3465b5a4997
Revises:
Create Date: 2026-10-29 18:37:35.059540+00:00

"""

from collections.abc import Sequence

revision: str = "a3465b5a4997"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

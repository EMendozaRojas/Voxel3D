import logging
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Response, status
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.openapi import Tag

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/health", tags=[Tag.HEALTH])


class HealthResponse(BaseModel):
    status: Literal["ok", "error"] = Field(description="Estado general del servidor.")
    database: Literal["ok", "unavailable"] = Field(
        description="Estado de la conexión con la base de datos."
    )


@router.get(
    "",
    response_model=HealthResponse,
    summary="Comprobar el estado del servidor",
    description=(
        "Comprueba que el servidor responde y que puede hablar con la base de datos. "
        "No necesita autenticación. Nunca muestra datos de la conexión."
    ),
    response_description="El servidor y la base de datos funcionan.",
    responses={
        503: {
            "model": HealthResponse,
            "description": "La base de datos no responde.",
            "content": {
                "application/json": {"example": {"status": "error", "database": "unavailable"}}
            },
        }
    },
)
def health(response: Response, db: Annotated[Session, Depends(get_db)]) -> HealthResponse:
    try:
        db.execute(text("SELECT 1"))
    except SQLAlchemyError:
        # El detalle (que puede incluir la dirección de la base) solo va al log
        # del servidor; la respuesta nunca lo muestra.
        logger.exception("La base de datos no responde")
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return HealthResponse(status="error", database="unavailable")
    return HealthResponse(status="ok", database="ok")

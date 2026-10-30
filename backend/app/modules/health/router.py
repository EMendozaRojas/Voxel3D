import logging
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Response, status
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.db import get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/health")


class HealthResponse(BaseModel):
    status: Literal["ok", "error"]
    database: Literal["ok", "unavailable"]


@router.get("", response_model=HealthResponse)
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

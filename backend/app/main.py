from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.modules.health.router import router as health_router

settings = get_settings()

# Punto de entrada de la API (uvicorn arranca `app.main:app`).
# Los metadatos en español llegan en la tarea 3.3.
app = FastAPI()

# El navegador solo deja llamar a la API desde los orígenes de
# BACKEND_CORS_ORIGINS (el frontend). Las cookies entre orígenes
# (allow_credentials) se decidirán en el change de autenticación.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1")

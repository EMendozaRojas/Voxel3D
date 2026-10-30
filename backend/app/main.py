from fastapi import FastAPI

from app.modules.health.router import router as health_router

# Punto de entrada de la API (uvicorn arranca `app.main:app`).
# CORS y los metadatos en español llegan en las tareas 3.2 y 3.3.
app = FastAPI()

app.include_router(health_router, prefix="/api/v1")

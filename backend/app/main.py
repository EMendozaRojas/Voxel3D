from fastapi import FastAPI

# Punto de entrada de la API (uvicorn arranca `app.main:app`).
# Por ahora sin rutas propias: el endpoint de estado, CORS y los metadatos
# en español llegan en las tareas 3.1 a 3.3.
app = FastAPI()

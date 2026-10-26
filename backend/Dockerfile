# --- base: Python y librerías principales (comunes a dev y prod) ---
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Usuario sin permisos de administrador para ejecutar el servidor
RUN useradd --create-home --shell /bin/bash appuser

# Primero las librerías y después el código, para aprovechar la caché de Docker
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# --- dev: añade tests, lint y tipos; recarga en caliente ---
FROM base AS dev

COPY requirements-dev.txt ./
RUN pip install --no-cache-dir -r requirements-dev.txt

COPY --chown=appuser:appuser . .

USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# --- prod: solo lo necesario para funcionar, sin herramientas ni tests ---
FROM base AS prod

# El código pertenece a root: appuser puede leerlo, pero no modificarlo
COPY app/ ./app/

USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

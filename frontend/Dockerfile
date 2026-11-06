# --- base: Node y ajustes comunes a todas las etapas ---
FROM node:22-alpine AS base

# Next.js no envía estadísticas de uso
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# --- deps: todas las librerías, una vez (Docker las guarda en caché) ---
FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci

# --- dev: servidor de desarrollo con recarga en caliente ---
FROM deps AS dev

COPY . .

# La imagen trae el usuario `node`, sin permisos de administrador. Necesita
# escribir en /app (carpeta .next, cachés de tests).
RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]

# --- builder: construye la web para producción ---
FROM deps AS builder

COPY . .

# NEXT_PUBLIC_API_URL se escribe dentro del código al construir: para otra
# dirección hay que volver a construir la imagen (--build-arg).
ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# public/ puede estar vacía y git no guarda carpetas vacías
RUN mkdir -p public && npm run build

# --- prod: solo el resultado de la construcción, sin herramientas ni tests ---
FROM base AS prod

ENV NODE_ENV=production \
    PORT=3000 \
    # Docker pone en HOSTNAME el nombre del contenedor: sin esto, el servidor
    # solo escucharía dentro del contenedor y no se podría abrir la web.
    HOSTNAME=0.0.0.0

# Los archivos pertenecen a root: `node` puede leerlos, pero no modificarlos.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER node

EXPOSE 3000

CMD ["node", "server.js"]

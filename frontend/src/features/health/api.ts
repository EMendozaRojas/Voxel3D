import { API_BASE_URL } from "@/lib/api";

/** Respuesta de `GET /api/v1/health` (ver backend/openapi.json). */
export interface HealthResponse {
  status: "ok" | "error";
  database: "ok" | "unavailable";
}

/**
 * Pregunta al servidor si funciona. Lanza un error si no responde, si responde
 * con un código de error (por ejemplo 503) o si dice que algo va mal.
 */
export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`El servidor respondió con el estado ${response.status}`);
  }
  const body = (await response.json()) as HealthResponse;
  if (body.status !== "ok") {
    throw new Error("El servidor no está funcionando correctamente");
  }
  return body;
}

"use client";

import { useHealth } from "./useHealth";

/** Muestra si la web puede hablar con el servidor: cargando, conectado o error. */
export function HealthStatus() {
  const { isPending, isError, refetch } = useHealth();

  let content;
  if (isPending) {
    content = <p>Comprobando la conexión con el servidor…</p>;
  } else if (isError) {
    content = (
      <>
        <p>No se puede conectar con el servidor. Inténtalo de nuevo en unos segundos.</p>
        {/* Al pulsar, la consulta vuelve a "cargando" y el botón desaparece,
            así no se puede pulsar dos veces seguidas. */}
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded border px-4 py-2"
        >
          Reintentar
        </button>
      </>
    );
  } else {
    content = <p>Conectado: el servidor funciona correctamente.</p>;
  }

  return (
    <section aria-labelledby="estado-servidor" className="text-center">
      <h1 id="estado-servidor" className="mb-4 text-2xl font-semibold">
        Estado del servidor
      </h1>
      {/* role="status": los lectores de pantalla anuncian cada cambio de estado. */}
      <div role="status">{content}</div>
    </section>
  );
}

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * Piezas que necesitan estar en el navegador alrededor de toda la web.
 * El QueryClient se crea una vez por visita (useState), no en cada render.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // Si una petición falla, se repite una sola vez antes de mostrar el
        // error (por defecto serían tres, y la persona esperaría demasiado).
        defaultOptions: { queries: { retry: 1 } },
      }),
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

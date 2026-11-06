import { useQuery } from "@tanstack/react-query";

import { getHealth } from "./api";

/** Estado del servidor, guardado y reintentado por TanStack Query. */
export function useHealth() {
  return useQuery({ queryKey: ["health"], queryFn: getHealth });
}

import type { HomeViewProps } from "@/lib/theme-contract";

/**
 * Portada de Voxel3D. Por ahora solo enseña el estado del servidor, dentro
 * de un marco metálico con remaches y barras de cobre.
 */
export function HomeView({ serverStatus }: HomeViewProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="decor-rivets decor-bars w-full max-w-md rounded-card border border-chip-border px-8 py-8 text-center shadow-[0_10px_24px_rgb(0_0_0/0.35)]">
        {serverStatus}
      </div>
    </div>
  );
}

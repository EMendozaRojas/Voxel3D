/**
 * Cubo voxel de Voxel3D. Es decorativo (los lectores de pantalla lo saltan):
 * icono del buscador y marcador de las fotos que aún no existen.
 */
export function VoxelCube({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <polygon points="50,8 90,30 50,52 10,30" className="fill-accent-text" />
      <polygon points="10,30 50,52 50,94 10,72" className="fill-accent-strong" />
      <polygon points="90,30 50,52 50,94 90,72" className="fill-badge" />
    </svg>
  );
}

import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Botón principal de Voxel3D: píldora de plata con texto oscuro. Desactivado
 * (por ejemplo, "Agotado") pasa a gris oscuro y no reacciona al pulsarlo.
 */
export function Button({ type = "button", className = "", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`min-h-11 rounded-pill px-5 font-label font-bold tracking-[1px] uppercase bg-button bg-(image:--gradient-button) text-on-button hover:brightness-105 disabled:cursor-not-allowed disabled:bg-button-disabled disabled:bg-(image:--gradient-button-disabled) disabled:text-on-button-disabled disabled:hover:brightness-100 ${className}`}
      {...props}
    />
  );
}

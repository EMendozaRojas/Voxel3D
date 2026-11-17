import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Vite 8 entiende los atajos de tsconfig.json (@/...) sin plugins extra.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    // Un nombre que no es de ninguna tienda real: así los tests demuestran
    // que el nombre llega de la configuración y no está escrito en el código.
    env: { NEXT_PUBLIC_STORE_NAME: "Tienda de prueba" },
    coverage: {
      provider: "v8",
      // Todo el código de src/ cuenta, también los archivos que ningún test
      // abre (si no, la cobertura saldría más alta de lo que es de verdad).
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/test/**"],
      reporter: ["text", "html"],
      // Por debajo del 70% el comando falla (y la CI se pone en rojo).
      thresholds: { lines: 70, statements: 70, functions: 70, branches: 70 },
    },
  },
});

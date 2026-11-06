import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Crea .next/standalone: solo los archivos necesarios para la imagen de producción.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

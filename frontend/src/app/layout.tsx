import type { Metadata } from "next";

import { Providers } from "@/components/Providers";

import "./globals.css";

// Título genérico: el nombre de la tienda llegará desde la configuración.
export const metadata: Metadata = {
  title: "Estado del servidor",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

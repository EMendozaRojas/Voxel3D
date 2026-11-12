import type { Metadata } from "next";

import { Providers } from "@/components/Providers";
import { STORE_NAME } from "@/config/store";

import "./globals.css";

// La portada se titula con el nombre de la tienda; cada página nueva solo
// pone el suyo ("Carrito") y Next.js añade detrás " · <tienda>".
export const metadata: Metadata = {
  title: { default: STORE_NAME, template: `%s · ${STORE_NAME}` },
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

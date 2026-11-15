import Image from "next/image";
import Link from "next/link";

import { STORE_NAME } from "@/config/store";

import { type Brand, brand as defaultBrand } from "../brand";

type LogoProps = {
  /** Por defecto, el de brand.ts. Los tests pasan otro para probar los dos tipos. */
  brand?: Brand;
  storeName?: string;
};

/** Logo de la tienda: siempre enlaza a la portada. */
export function Logo({ brand = defaultBrand, storeName = STORE_NAME }: LogoProps) {
  return (
    <Link href="/" className="inline-block shrink-0 leading-none">
      {brand.type === "image" ? (
        <Image
          src={brand.src}
          alt={brand.alt}
          width={brand.width}
          height={brand.height}
          // Está arriba en todas las páginas: se carga sin esperar.
          loading="eager"
          className="h-10 w-auto sm:h-14"
        />
      ) : (
        <span className="decor-logo-glow bg-(image:--gradient-logo) bg-clip-text font-logo text-[26px] text-transparent uppercase sm:text-[44px]">
          {storeName}
        </span>
      )}
    </Link>
  );
}

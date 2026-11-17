import type { CategoryOption } from "@/hooks/useCategoryChips";
import type { ProductSummary } from "@/lib/theme-contract";

/**
 * Datos de ejemplo para `/muestrario` (solo en desarrollo). Son de la tienda:
 * cada una pone los suyos. Diseños propios, sin marcas registradas.
 */
export const showcaseLowStockThreshold = 5;

export const showcaseCategories: CategoryOption[] = [
  { value: "", label: "Todos" },
  { value: "hogar", label: "Hogar" },
  { value: "animales", label: "Animales" },
  { value: "geek", label: "Geek" },
  { value: "lamparas", label: "Lámparas" },
];

export const showcaseProducts: ProductSummary[] = [
  {
    id: "maceta-geometrica",
    name: "Maceta geométrica",
    priceCents: 1490,
    shortDescription: "PLA · Seda cobre",
    stock: 3,
  },
  {
    id: "dragon-articulado",
    name: "Dragón articulado",
    priceCents: 2250,
    shortDescription: "PLA · Mármol",
    stock: 12,
  },
  {
    id: "lampara-litofania",
    name: "Lámpara de litofanía",
    priceCents: 2900,
    shortDescription: "PLA · Blanco",
    stock: 0,
  },
  {
    id: "organizador-escritorio",
    name: "Organizador de escritorio",
    priceCents: 1875,
    shortDescription: "PETG · Madera",
    stock: 7,
  },
];

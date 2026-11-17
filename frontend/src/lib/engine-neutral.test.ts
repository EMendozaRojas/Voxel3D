import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * El motor no conoce ninguna tienda.
 *
 * Recorre todo `src/` salvo la carrocería (`theme/`) y la configuración de la
 * tienda (`config/`), y falla si encuentra colores escritos a mano o palabras
 * propias de Voxel3D. Si salta, lo que hay que cambiar va en `theme/` o en
 * `config/`, no en el motor.
 */
const SRC = join(__dirname, "..");
const STORE_FOLDERS = ["theme", "config"];
const CODE_FILE = /\.(ts|tsx|css|mts)$/;
const THIS_FILE = relative(SRC, __filename);

const RULES: { name: string; pattern: RegExp }[] = [
  { name: "color hexadecimal", pattern: /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/i },
  { name: "nombre de la tienda", pattern: /voxel3d/i },
  { name: "palabra de la carrocería", pattern: /cobre/i },
];

/** Archivos de código del motor, con su ruta relativa a `src/`. */
function engineFiles(dir = SRC): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    const rel = relative(SRC, path);
    if (entry.isDirectory()) return STORE_FOLDERS.includes(rel) ? [] : engineFiles(path);
    return CODE_FILE.test(entry.name) && rel !== THIS_FILE ? [rel] : [];
  });
}

/** Lista de problemas encontrados en un texto: "regla (línea N)". */
function findProblems(text: string): string[] {
  return text
    .split("\n")
    .flatMap((line, i) =>
      RULES.filter((rule) => rule.pattern.test(line)).map(
        (rule) => `${rule.name} (línea ${i + 1})`,
      ),
    );
}

describe("Motor neutro", () => {
  const files = engineFiles();

  it("encuentra archivos del motor y deja fuera theme/ y config/", () => {
    expect(files).toContain(join("app", "layout.tsx"));
    expect(files.some((f) => f.startsWith("theme/") || f.startsWith("config/"))).toBe(false);
  });

  it.each(files)("%s no tiene nada propio de una tienda", (file) => {
    expect(findProblems(readFileSync(join(SRC, file), "utf8"))).toEqual([]);
  });

  it("detecta un color, el nombre de la tienda y una palabra de la carrocería", () => {
    expect(findProblems('<p className="text-[#d9772f]">Voxel3D</p>')).toEqual([
      "color hexadecimal (línea 1)",
      "nombre de la tienda (línea 1)",
    ]);
    expect(findProblems("// borde\n// cobre")).toEqual(["palabra de la carrocería (línea 2)"]);
  });
});

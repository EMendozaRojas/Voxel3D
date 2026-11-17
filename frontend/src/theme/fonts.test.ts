import { describe, expect, it } from "vitest";

import { fontVariables } from "./fonts";

describe("Fuentes del tema", () => {
  it("declara las tres variables que usa theme.css", () => {
    expect(fontVariables.split(" ")).toEqual([
      "--font-store-logo",
      "--font-store-label",
      "--font-store-body",
    ]);
  });
});

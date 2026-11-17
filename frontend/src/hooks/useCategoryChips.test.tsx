import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type CategoryOption, useCategoryChips } from "./useCategoryChips";

const options: CategoryOption[] = [
  { value: "", label: "Todos" },
  { value: "hogar", label: "Hogar" },
  { value: "animales", label: "Animales" },
  { value: "geek", label: "Geek" },
  { value: "lamparas", label: "Lámparas" },
];

describe("useCategoryChips", () => {
  it("reparte los chips: los primeros visibles y el resto en Más", () => {
    const { result } = renderHook(() => useCategoryChips({ options, visibleCount: 3 }));
    expect(result.current.visible.map((o) => o.label)).toEqual(["Todos", "Hogar", "Animales"]);
    expect(result.current.overflow.map((o) => o.label)).toEqual(["Geek", "Lámparas"]);
  });

  it("empieza con la primera elegida y el botón dice Más", () => {
    const { result } = renderHook(() => useCategoryChips({ options, visibleCount: 3 }));
    expect(result.current.selected).toBe("");
    expect(result.current.moreLabel).toBe("Más");
    expect(result.current.moreActive).toBe(false);
  });

  it("elegir una del panel: la marca, cierra el panel y Más lleva su nombre", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useCategoryChips({ options, visibleCount: 3, onChange }));
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.select("geek"));
    expect(result.current.selected).toBe("geek");
    expect(result.current.isOpen).toBe(false);
    expect(result.current.moreLabel).toBe("Geek");
    expect(result.current.moreActive).toBe(true);
    expect(onChange).toHaveBeenCalledWith("geek");
  });

  it("elegir una visible después: Más vuelve a decir Más", () => {
    const { result } = renderHook(() =>
      useCategoryChips({ options, visibleCount: 3, initialValue: "geek" }),
    );
    expect(result.current.moreLabel).toBe("Geek");
    act(() => result.current.select("hogar"));
    expect(result.current.moreLabel).toBe("Más");
    expect(result.current.moreActive).toBe(false);
  });

  it("con pocas categorías no hay nada en el panel", () => {
    const { result } = renderHook(() =>
      useCategoryChips({ options: options.slice(0, 2), visibleCount: 3 }),
    );
    expect(result.current.overflow).toEqual([]);
  });

  it("sin categorías no falla", () => {
    const { result } = renderHook(() => useCategoryChips({ options: [], visibleCount: 3 }));
    expect(result.current.selected).toBe("");
    expect(result.current.visible).toEqual([]);
  });
});

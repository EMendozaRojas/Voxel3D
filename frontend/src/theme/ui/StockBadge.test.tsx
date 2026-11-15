import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getStockStatus } from "@/lib/stock";

import { StockBadge } from "./StockBadge";

describe("StockBadge", () => {
  it.each([
    [0, "Agotado"],
    [3, "Quedan 3"],
    [12, "En stock"],
  ])("con stock %i muestra el texto del motor: «%s»", (stock, label) => {
    render(<StockBadge status={getStockStatus(stock, 5)} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});

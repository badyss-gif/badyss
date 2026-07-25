import { describe, expect, it } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats a numeric MAD price", () => {
    expect(formatPrice(190)).toContain("190");
  });

  it("parses a numeric string price", () => {
    expect(formatPrice("350.00")).toContain("350");
  });

  it("returns null for invalid input", () => {
    expect(formatPrice("not-a-number")).toBeNull();
  });
});

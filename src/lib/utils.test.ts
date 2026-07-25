import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("resolves conflicting Tailwind classes, keeping the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("drops falsy values", () => {
    expect(cn("text-red-500", false && "hidden", "font-bold")).toBe("text-red-500 font-bold");
  });
});

import { describe, expect, it } from "vitest";
import { isValidMoroccanPhone, normalizePhone } from "./validation";

describe("isValidMoroccanPhone", () => {
  it("accepts local mobile numbers", () => {
    expect(isValidMoroccanPhone("0612345678")).toBe(true);
    expect(isValidMoroccanPhone("0712345678")).toBe(true);
  });

  it("accepts local landline numbers", () => {
    expect(isValidMoroccanPhone("0512345678")).toBe(true);
  });

  it("accepts spaced/dashed formatting", () => {
    expect(isValidMoroccanPhone("06 12 34 56 78")).toBe(true);
    expect(isValidMoroccanPhone("06-12-34-56-78")).toBe(true);
  });

  it("accepts international formats", () => {
    expect(isValidMoroccanPhone("+212612345678")).toBe(true);
    expect(isValidMoroccanPhone("212612345678")).toBe(true);
    expect(isValidMoroccanPhone("+212 6 12 34 56 78")).toBe(true);
  });

  it("rejects invalid prefixes", () => {
    expect(isValidMoroccanPhone("0812345678")).toBe(false);
    expect(isValidMoroccanPhone("0412345678")).toBe(false);
  });

  it("rejects wrong lengths", () => {
    expect(isValidMoroccanPhone("061234567")).toBe(false);
    expect(isValidMoroccanPhone("06123456789")).toBe(false);
  });

  it("rejects non-numeric or empty input", () => {
    expect(isValidMoroccanPhone("")).toBe(false);
    expect(isValidMoroccanPhone("abcdefghij")).toBe(false);
  });
});

describe("normalizePhone", () => {
  it("strips spaces, dots and dashes", () => {
    expect(normalizePhone("06 12.34-56 78")).toBe("0612345678");
  });
});

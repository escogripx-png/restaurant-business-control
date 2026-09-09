import { describe, it, expect } from "vitest";
import { minorToMajor, majorToMinor, formatMoney } from "@/lib/money";

describe("money conversions", () => {
  it("converts minor to major units", () => {
    expect(minorToMajor(187450_00)).toBe(187450);
    expect(minorToMajor(50)).toBe(0.5);
  });

  it("converts major to minor units without float drift", () => {
    expect(majorToMinor(857)).toBe(85700);
    expect(majorToMinor(19.99)).toBe(1999);
    expect(majorToMinor(0.1 + 0.2)).toBe(30); // classic float trap, guarded by Math.round
  });

  it("formats CZK with no decimal places", () => {
    expect(formatMoney(18745000, "CZK")).toContain("187");
    expect(formatMoney(18745000, "CZK")).not.toMatch(/,\d{2}(?!\d)/);
  });
});

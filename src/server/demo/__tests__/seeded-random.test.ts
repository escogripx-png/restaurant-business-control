import { describe, it, expect } from "vitest";
import { seededRandom } from "@/server/demo/seeded-random";

describe("seededRandom", () => {
  it("stays within [0, 1)", () => {
    for (const seed of ["a", "seed-restaurant-1", "", "x".repeat(50)]) {
      const value = seededRandom(seed);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("is deterministic for the same seed", () => {
    expect(seededRandom("seed-restaurant-1")).toBe(seededRandom("seed-restaurant-1"));
  });

  it("avalanches on a single trailing-character difference", () => {
    // Regression test: a plain polynomial hash (hash*31+c) barely changes
    // when only the last character differs, which made every demo
    // restaurant (ids "seed-restaurant-1", "seed-restaurant-2", ...) show
    // near-identical KPI numbers on the dashboard. A single pair can still
    // land close by chance with a good hash, so assert spread across a
    // batch of same-shaped seeds instead of one specific pair.
    const values = Array.from({ length: 10 }, (_, i) => seededRandom(`seed-restaurant-${i}`));
    const range = Math.max(...values) - Math.min(...values);
    expect(range).toBeGreaterThan(0.5);
    expect(new Set(values.map((v) => v.toFixed(3))).size).toBe(values.length);
  });
});

/**
 * UI-development-only fixtures for table occupancy (see mock-metrics.ts for
 * the rationale). Real numbers need iiko table/seating data (Phase 3).
 */
import { seededRandom } from "@/server/demo/seeded-random";

export type DemoTableStatus = {
  totalTables: number;
  occupiedTables: number;
  occupancyPct: number;
  avgTableTimeMinutes: number;
};

export function getDemoTableStatus(restaurantId: string): DemoTableStatus {
  const r = seededRandom(`${restaurantId}-tables`);
  const totalTables = 15 + Math.round(r * 15);
  const occupiedTables = Math.min(totalTables, Math.round(totalTables * (0.3 + r * 0.5)));
  return {
    totalTables,
    occupiedTables,
    occupancyPct: Math.round((occupiedTables / totalTables) * 100),
    avgTableTimeMinutes: Math.round(35 + r * 40),
  };
}

export function getDemoOccupancyByHour(restaurantId: string) {
  const hours = [11, 12, 13, 14, 17, 18, 19, 20, 21, 22];
  return hours.map((hour) => {
    const r = seededRandom(`${restaurantId}-occ-hour-${hour}`);
    return { hour, occupancyPct: Math.round(20 + r * 75) };
  });
}

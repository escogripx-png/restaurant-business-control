/**
 * UI-development-only demo data (MASTER SPEC §9/§43: mock adapters are for
 * development, never production logic). This module must never be imported
 * from finance/analytics services — it exists purely so the dashboard shell
 * has something to render before the iiko connector (Phase 3) exists.
 * Delete this module once real Order data flows through AnalyticsSnapshot.
 */

export type RestaurantDemoMetrics = {
  restaurantId: string;
  closedRevenueMinor: number;
  openOrdersMinor: number;
  orderCount: number;
  changeVsPreviousPct: number;
};

function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash / 0xffffffff;
}

export function getDemoMetricsForRestaurant(restaurantId: string): RestaurantDemoMetrics {
  const r = seededRandom(restaurantId);
  return {
    restaurantId,
    closedRevenueMinor: Math.round((120_000 + r * 100_000) * 100),
    openOrdersMinor: Math.round((15_000 + r * 40_000) * 100),
    orderCount: Math.round(150 + r * 200),
    changeVsPreviousPct: Math.round((r - 0.5) * 40 * 10) / 10,
  };
}

export function sumDemoMetrics(metrics: RestaurantDemoMetrics[]): Omit<RestaurantDemoMetrics, "restaurantId" | "changeVsPreviousPct"> & {
  changeVsPreviousPct: number;
} {
  const closedRevenueMinor = metrics.reduce((sum, m) => sum + m.closedRevenueMinor, 0);
  const openOrdersMinor = metrics.reduce((sum, m) => sum + m.openOrdersMinor, 0);
  const orderCount = metrics.reduce((sum, m) => sum + m.orderCount, 0);
  const avgChange =
    metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m.changeVsPreviousPct, 0) / metrics.length
      : 0;

  return {
    closedRevenueMinor,
    openOrdersMinor,
    orderCount,
    changeVsPreviousPct: Math.round(avgChange * 10) / 10,
  };
}

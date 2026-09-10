/**
 * UI-development-only fixtures for warehouse/stock (see mock-metrics.ts for
 * the rationale).
 *
 * NOTE ON SCOPE: MASTER SPEC §43 explicitly lists "inventory replacement" as
 * OUT of the v1 scope. The owner explicitly asked to bring stock tracking
 * into scope now (2026-09-10) despite that, so this section exists as a
 * demo-data placeholder — real stock levels need iiko's warehouse/stock API
 * (Phase 3) and a decision on whether this app tracks inventory itself or
 * only mirrors iiko's.
 */
import { seededRandom } from "@/server/demo/seeded-random";

const STOCK_ITEMS: { name: string; unit: string }[] = [
  { name: "Говядина", unit: "кг" },
  { name: "Курица", unit: "кг" },
  { name: "Сыр моцарелла", unit: "кг" },
  { name: "Мука", unit: "кг" },
  { name: "Томаты", unit: "кг" },
  { name: "Вино красное", unit: "бут." },
  { name: "Пиво разливное", unit: "л" },
  { name: "Молоко", unit: "л" },
  { name: "Картофель", unit: "кг" },
  { name: "Рис", unit: "кг" },
];

export type DemoStockItem = {
  name: string;
  unit: string;
  quantityRemaining: number;
  reorderThreshold: number;
  isLow: boolean;
};

export function getDemoStock(restaurantId: string): DemoStockItem[] {
  return STOCK_ITEMS.map((item, i) => {
    const r = seededRandom(`${restaurantId}-stock-${i}`);
    const reorderThreshold = Math.round(5 + r * 15);
    const quantityRemaining = Math.round(r * 60);
    return {
      ...item,
      quantityRemaining,
      reorderThreshold,
      isLow: quantityRemaining <= reorderThreshold,
    };
  });
}

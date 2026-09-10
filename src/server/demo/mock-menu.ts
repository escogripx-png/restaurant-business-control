/**
 * UI-development-only fixtures for menu/product performance (see
 * mock-metrics.ts for the rationale). Master spec §27 covers this once
 * iiko order-items data is wired up in Phase 3 — this is a structural
 * placeholder only.
 */
import { seededRandom } from "@/server/demo/seeded-random";

const MENU_ITEMS = [
  "Борщ",
  "Цезарь с курицей",
  "Паста Карбонара",
  "Стейк Рибай",
  "Пицца Маргарита",
  "Сет роллов",
  "Тирамису",
  "Чизкейк",
  "Морс домашний",
  "Лимонад",
  "Плов",
  "Хачапури по-аджарски",
  "Оливье",
  "Сырники",
  "Гречка с грибами",
];

export type DemoMenuItem = {
  name: string;
  quantitySold: number;
  revenueMinor: number;
};

export function getDemoMenuItems(restaurantId: string): DemoMenuItem[] {
  return MENU_ITEMS.map((name, i) => {
    const r = seededRandom(`${restaurantId}-menu-${i}`);
    const quantitySold = Math.round(3 + r * 180);
    const avgPriceMinor = Math.round((250 + r * 900) * 100);
    return { name, quantitySold, revenueMinor: quantitySold * avgPriceMinor };
  });
}

export function getTopMenuItems(restaurantId: string, count = 5): DemoMenuItem[] {
  return [...getDemoMenuItems(restaurantId)]
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, count);
}

export function getBottomMenuItems(restaurantId: string, count = 5): DemoMenuItem[] {
  return [...getDemoMenuItems(restaurantId)]
    .sort((a, b) => a.quantitySold - b.quantitySold)
    .slice(0, count);
}

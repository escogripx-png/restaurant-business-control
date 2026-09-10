/**
 * UI-development-only fixtures for tech cards (recipes) and automatic stock
 * write-off (see mock-metrics.ts for the rationale).
 *
 * ARCHITECTURE NOTE (2026-09-10): the owner explicitly wants stock/inventory
 * to be OUR OWN domain, not read from iiko — iiko's stock module is "weak"
 * for their needs. This reverses the general "iiko is the source of truth"
 * principle specifically for warehouse/stock: Orders/OrderItems still come
 * from iiko, but TechCard → ingredient recipes and the resulting stock
 * ledger are owned and computed by this app. A real implementation needs:
 *   - TechCard entity: dish -> [{ ingredientId, quantity, unit }]
 *   - StockLevel entity: per-restaurant running balance per ingredient
 *   - A write-off job that decrements StockLevel whenever an iiko order
 *     line for that dish closes.
 * This module only fakes the shape of that so the UI structure can be
 * reviewed before that's built for real.
 */
import { seededRandom } from "@/server/demo/seeded-random";
import { getDemoOrders } from "@/server/demo/mock-operations";

export type RecipeLine = { ingredient: string; quantity: number; unit: "г" | "мл" };

const RECIPES: Record<string, RecipeLine[]> = {
  "Борщ": [
    { ingredient: "Говядина", quantity: 150, unit: "г" },
    { ingredient: "Картофель", quantity: 120, unit: "г" },
    { ingredient: "Томаты", quantity: 50, unit: "г" },
  ],
  "Цезарь с курицей": [
    { ingredient: "Курица", quantity: 120, unit: "г" },
    { ingredient: "Сыр моцарелла", quantity: 30, unit: "г" },
  ],
  "Паста Карбонара": [
    { ingredient: "Мука", quantity: 100, unit: "г" },
    { ingredient: "Молоко", quantity: 50, unit: "мл" },
  ],
  "Стейк Рибай": [{ ingredient: "Говядина", quantity: 300, unit: "г" }],
  "Пицца Маргарита": [
    { ingredient: "Мука", quantity: 200, unit: "г" },
    { ingredient: "Сыр моцарелла", quantity: 100, unit: "г" },
    { ingredient: "Томаты", quantity: 80, unit: "г" },
  ],
  "Сет роллов": [{ ingredient: "Рис", quantity: 150, unit: "г" }],
  "Тирамису": [{ ingredient: "Молоко", quantity: 100, unit: "мл" }],
  "Чизкейк": [{ ingredient: "Сыр моцарелла", quantity: 150, unit: "г" }],
  "Плов": [
    { ingredient: "Рис", quantity: 150, unit: "г" },
    { ingredient: "Курица", quantity: 100, unit: "г" },
  ],
  "Хачапури по-аджарски": [
    { ingredient: "Мука", quantity: 180, unit: "г" },
    { ingredient: "Сыр моцарелла", quantity: 120, unit: "г" },
  ],
  "Оливье": [
    { ingredient: "Картофель", quantity: 100, unit: "г" },
    { ingredient: "Говядина", quantity: 50, unit: "г" },
  ],
  "Сырники": [{ ingredient: "Молоко", quantity: 60, unit: "мл" }],
  "Гречка с грибами": [{ ingredient: "Картофель", quantity: 60, unit: "г" }],
  "Морс домашний": [],
  "Лимонад": [],
};

export function getRecipe(dishName: string): RecipeLine[] {
  return RECIPES[dishName] ?? [];
}

export type DemoWriteOff = {
  orderId: string;
  dishName: string;
  ingredients: RecipeLine[];
  at: string;
};

/**
 * Fakes "an order closed -> its recipe lines got deducted from stock",
 * derived from the same demo orders shown on Live/Orders so the numbers
 * feel connected instead of arbitrary.
 */
export function getDemoWriteOffs(restaurantId: string): DemoWriteOff[] {
  return getDemoOrders(restaurantId)
    .filter((o) => o.status === "CLOSED")
    .map((order, i) => {
      const dishNames = Object.keys(RECIPES).filter((name) => RECIPES[name].length > 0);
      const dishName = dishNames[Math.floor(seededRandom(`${restaurantId}-wo-dish-${i}`) * dishNames.length)];
      return {
        orderId: order.id,
        dishName,
        ingredients: getRecipe(dishName),
        at: order.openedAt,
      };
    })
    .slice(0, 6);
}

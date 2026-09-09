import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockDeep, mockReset, type DeepMockProxy } from "vitest-mock-extended";
import type { PrismaClient } from "@prisma/client";

vi.mock("@/server/db/prisma", () => ({
  prisma: mockDeep<PrismaClient>(),
}));

import { prisma } from "@/server/db/prisma";
import {
  getAccessibleRestaurantIds,
  assertCanAccessRestaurant,
  requireRole,
} from "@/server/auth/permissions";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("getAccessibleRestaurantIds", () => {
  it("returns every restaurant in the org for OWNER, ignoring RestaurantAccess", async () => {
    prismaMock.restaurant.findMany.mockResolvedValue([
      { id: "r1" },
      { id: "r2" },
    ] as never);

    const ids = await getAccessibleRestaurantIds({
      id: "u1",
      organizationId: "org-a",
      role: "OWNER",
    });

    expect(ids).toEqual(["r1", "r2"]);
    expect(prismaMock.restaurant.findMany).toHaveBeenCalledWith({
      where: { organizationId: "org-a" },
      select: { id: true },
    });
    expect(prismaMock.restaurantAccess.findMany).not.toHaveBeenCalled();
  });

  it("returns only granted restaurants for MANAGER", async () => {
    prismaMock.restaurantAccess.findMany.mockResolvedValue([
      { restaurantId: "r1" },
    ] as never);

    const ids = await getAccessibleRestaurantIds({
      id: "u2",
      organizationId: "org-a",
      role: "MANAGER",
    });

    expect(ids).toEqual(["r1"]);
    expect(prismaMock.restaurant.findMany).not.toHaveBeenCalled();
  });
});

describe("assertCanAccessRestaurant — tenant isolation", () => {
  it("rejects a restaurant that belongs to a different organization, even for OWNER", async () => {
    prismaMock.restaurant.findUnique.mockResolvedValue({
      organizationId: "org-b",
    } as never);

    await expect(
      assertCanAccessRestaurant(
        { id: "u1", organizationId: "org-a", role: "OWNER" },
        "restaurant-owned-by-org-b",
      ),
    ).rejects.toThrow("Restaurant not found");
  });

  it("rejects a restaurant that does not exist", async () => {
    prismaMock.restaurant.findUnique.mockResolvedValue(null);

    await expect(
      assertCanAccessRestaurant(
        { id: "u1", organizationId: "org-a", role: "OWNER" },
        "nonexistent",
      ),
    ).rejects.toThrow("Restaurant not found");
  });

  it("allows OWNER to access any restaurant within their own organization", async () => {
    prismaMock.restaurant.findUnique.mockResolvedValue({
      organizationId: "org-a",
    } as never);

    await expect(
      assertCanAccessRestaurant(
        { id: "u1", organizationId: "org-a", role: "OWNER" },
        "restaurant-in-org-a",
      ),
    ).resolves.toBeUndefined();
    expect(prismaMock.restaurantAccess.findUnique).not.toHaveBeenCalled();
  });

  it("rejects MANAGER without an explicit RestaurantAccess grant", async () => {
    prismaMock.restaurant.findUnique.mockResolvedValue({
      organizationId: "org-a",
    } as never);
    prismaMock.restaurantAccess.findUnique.mockResolvedValue(null);

    await expect(
      assertCanAccessRestaurant(
        { id: "manager-1", organizationId: "org-a", role: "MANAGER" },
        "restaurant-in-org-a",
      ),
    ).rejects.toThrow("Forbidden");
  });

  it("allows MANAGER with an explicit RestaurantAccess grant", async () => {
    prismaMock.restaurant.findUnique.mockResolvedValue({
      organizationId: "org-a",
    } as never);
    prismaMock.restaurantAccess.findUnique.mockResolvedValue({
      id: "access-1",
      userId: "manager-1",
      restaurantId: "restaurant-in-org-a",
      createdAt: new Date(),
    } as never);

    await expect(
      assertCanAccessRestaurant(
        { id: "manager-1", organizationId: "org-a", role: "MANAGER" },
        "restaurant-in-org-a",
      ),
    ).resolves.toBeUndefined();
  });
});

describe("requireRole", () => {
  it("throws when the user's role is not in the allowed list", () => {
    expect(() =>
      requireRole({ id: "u1", organizationId: "org-a", role: "MANAGER" }, ["OWNER"]),
    ).toThrow("Forbidden");
  });

  it("does not throw when the user's role is allowed", () => {
    expect(() =>
      requireRole({ id: "u1", organizationId: "org-a", role: "OWNER" }, ["OWNER"]),
    ).not.toThrow();
  });
});

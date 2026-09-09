import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const org = await prisma.organization.upsert({
    where: { id: "seed-org-1" },
    update: {},
    create: {
      id: "seed-org-1",
      name: "Demo Restaurant Group",
    },
  });

  const [prague1, prague2] = await Promise.all([
    prisma.restaurant.upsert({
      where: { id: "seed-restaurant-1" },
      update: {},
      create: {
        id: "seed-restaurant-1",
        organizationId: org.id,
        name: "Restaurant Prague 1",
        timezone: "Europe/Prague",
        currency: "CZK",
      },
    }),
    prisma.restaurant.upsert({
      where: { id: "seed-restaurant-2" },
      update: {},
      create: {
        id: "seed-restaurant-2",
        organizationId: org.id,
        name: "Restaurant Prague 2",
        timezone: "Europe/Prague",
        currency: "CZK",
      },
    }),
  ]);

  const owner = await prisma.user.upsert({
    where: { email: "owner@demo.local" },
    update: {},
    create: {
      organizationId: org.id,
      email: "owner@demo.local",
      passwordHash,
      name: "Demo Owner",
      role: "OWNER",
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@demo.local" },
    update: {},
    create: {
      organizationId: org.id,
      email: "manager@demo.local",
      passwordHash,
      name: "Demo Manager",
      role: "MANAGER",
    },
  });

  // Manager only gets access to Prague 1, to exercise RestaurantAccess scoping.
  await prisma.restaurantAccess.upsert({
    where: { userId_restaurantId: { userId: manager.id, restaurantId: prague1.id } },
    update: {},
    create: { userId: manager.id, restaurantId: prague1.id },
  });

  console.log("Seeded:", {
    organization: org.name,
    restaurants: [prague1.name, prague2.name],
    users: [
      { email: owner.email, role: owner.role },
      { email: manager.email, role: manager.role, access: [prague1.name] },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { prisma } from "@/server/db/prisma";
import type { Prisma } from "@prisma/client";

export function writeAuditLog(entry: {
  organizationId: string;
  actorId?: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: Prisma.InputJsonValue;
}) {
  return prisma.auditLog.create({ data: entry });
}

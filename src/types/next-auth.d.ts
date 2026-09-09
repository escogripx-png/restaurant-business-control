import type { UserRole } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    organizationId: string;
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      organizationId: string;
      role: UserRole;
      name?: string | null;
      email?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    organizationId: string;
    role: UserRole;
  }
}

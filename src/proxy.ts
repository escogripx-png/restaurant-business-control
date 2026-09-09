import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Next.js 16 renamed the "middleware" file convention to "proxy". We
// implement the auth check directly with getToken() instead of re-exporting
// next-auth/middleware's default export, because that re-export wasn't
// recognized as a function by Next's new proxy-export static analysis.
export default async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/live/:path*",
    "/restaurants/:path*",
    "/orders/:path*",
    "/employees/:path*",
    "/finance/:path*",
    "/analytics/:path*",
    "/operations/:path*",
    "/alerts/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};

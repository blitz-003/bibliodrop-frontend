import { NextResponse } from "next/server";
import { authClient } from "@/lib/auth-client";

export async function middleware(req) {
  const session = await authClient.getSession();

  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !session?.data?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

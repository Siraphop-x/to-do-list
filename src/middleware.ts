import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isDashboard = pathname.startsWith("/dashboard");

  // 1. If on auth page and already logged in, redirect away to dashboard
  // (Note: this only runs if these pages are NOT excluded from the matcher below)
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard/upcoming", req.url));
  }

  // 2. Protect dashboard pages for unauthenticated users
  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3. Handle root path redirect
  if (pathname === "/") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard/upcoming", req.url));
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Fix "Too many redirects" by excluding common static assets and the login/register pages themselves.
  // This ensures that hitting the login page doesn't re-trigger the middleware checks.
  matcher: [
    "/((?!api|login|register|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};

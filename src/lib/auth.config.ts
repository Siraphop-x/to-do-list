// src/lib/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isDashboard = pathname.startsWith("/dashboard");
      const isAuthPage = pathname === "/login" || pathname === "/register";

      // 1. ถ้าพยายามเข้าหน้า Dashboard แต่ยังไม่ Login -> ให้เด้งไปหน้า Login อัตโนมัติ
      if (isDashboard) {
        if (isLoggedIn) return true;
        return false; // Auth.js จะพาไปหน้า pages.signIn (/login) เอง
      }

      // 2. ถ้า Login แล้ว แต่อยากเข้าหน้า Login/Register -> ให้ไล่ไปหน้า Dashboard
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard/upcoming", nextUrl));
      }

      // 3. จัดการหน้า Root (/)
      if (pathname === "/") {
        const target = isLoggedIn ? "/dashboard/upcoming" : "/login";
        return Response.redirect(new URL(target, nextUrl));
      }

      return true; // หน้าอื่น ๆ ให้เข้าถึงได้ตามปกติ
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export default NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
}).auth;

export const config = {
  // ยกเว้น login, register, api, static files — ป้องกัน redirect ซ้ำ
  matcher: [
    "/((?!api|login|register|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};

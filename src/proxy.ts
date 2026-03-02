// src/proxy.ts
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// ใช้ความสามารถของ NextAuth ในการจัดการ Middleware โดยตรง
export default NextAuth(authConfig).auth;

export const config = {
  // matcher นี้จะดักหน้าส่วนใหญ่ แต่ยกเว้นไฟล์ static และหน้าหลักที่จำเป็น
  // เพื่อไม่ให้เกิดการสั่ง Redirect ซ้อนกันจนเกิด Loop
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

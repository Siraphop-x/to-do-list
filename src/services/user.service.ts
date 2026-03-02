import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function createUser(name: string, email: string, password: string) {
  const hashedPassword = await hash(password, 12);
  return prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

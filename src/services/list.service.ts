import { prisma } from "@/lib/prisma";

export async function getListsByUserId(userId: string) {
  return prisma.list.findMany({
    where: { userId },
    include: { _count: { select: { tasks: { where: { completed: false } } } } },
    orderBy: { name: "asc" },
  });
}

export async function createList(userId: string, name: string, color: string = "#C74B4B") {
  return prisma.list.create({ data: { userId, name, color } });
}

export async function deleteList(listId: string, userId: string) {
  const list = await prisma.list.findFirst({ where: { id: listId, userId } });
  if (!list) throw new Error("List not found");
  return prisma.list.delete({ where: { id: listId } });
}

import { prisma } from "@/lib/prisma";

export async function getTagsByUserId(userId: string) {
  return prisma.tag.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export async function createTag(userId: string, name: string) {
  return prisma.tag.create({ data: { userId, name } });
}

export async function deleteTag(tagId: string, userId: string) {
  const tag = await prisma.tag.findFirst({ where: { id: tagId, userId } });
  if (!tag) throw new Error("Tag not found");
  return prisma.tag.delete({ where: { id: tagId } });
}

import { prisma } from "@/lib/prisma";

export async function getStickyNotesByUserId(userId: string) {
  return prisma.stickyNote.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function createStickyNote(
  userId: string,
  title: string,
  content: string = "",
  color: string = "yellow"
) {
  return prisma.stickyNote.create({
    data: { userId, title, content, color },
  });
}

export async function updateStickyNote(
  noteId: string,
  userId: string,
  data: { title?: string; content?: string; color?: string }
) {
  const note = await prisma.stickyNote.findFirst({
    where: { id: noteId, userId },
  });
  if (!note) throw new Error("Note not found");
  return prisma.stickyNote.update({
    where: { id: noteId },
    data,
  });
}

export async function deleteStickyNote(noteId: string, userId: string) {
  const note = await prisma.stickyNote.findFirst({
    where: { id: noteId, userId },
  });
  if (!note) throw new Error("Note not found");
  return prisma.stickyNote.delete({ where: { id: noteId } });
}

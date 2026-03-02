"use server";

import { auth } from "@/lib/auth";
import { stickyNoteSchema } from "@/lib/validations";
import {
  createStickyNote,
  updateStickyNote,
  deleteStickyNote,
} from "@/services/sticky-note.service";
import { revalidatePath } from "next/cache";

export async function createStickyNoteAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = {
    title: formData.get("title") as string,
    content: (formData.get("content") as string) || "",
    color: (formData.get("color") as string) || "yellow",
  };

  const parsed = stickyNoteSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await createStickyNote(
    session.user.id,
    parsed.data.title,
    parsed.data.content || "",
    parsed.data.color || "yellow"
  );

  revalidatePath("/dashboard/sticky-wall");
}

export async function updateStickyNoteAction(noteId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data: { title?: string; content?: string; color?: string } = {};
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const color = formData.get("color") as string;

  if (title) data.title = title;
  if (content !== null) data.content = content;
  if (color) data.color = color;

  await updateStickyNote(noteId, session.user.id, data);
  revalidatePath("/dashboard/sticky-wall");
}

export async function deleteStickyNoteAction(noteId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await deleteStickyNote(noteId, session.user.id);
  revalidatePath("/dashboard/sticky-wall");
}

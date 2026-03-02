"use server";

import { auth } from "@/lib/auth";
import { listSchema } from "@/lib/validations";
import { createList, deleteList } from "@/services/list.service";
import { revalidatePath } from "next/cache";

export async function createListAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name") as string,
    color: (formData.get("color") as string) || "#C74B4B",
  };

  const parsed = listSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await createList(session.user.id, parsed.data.name, parsed.data.color || "#C74B4B");
  revalidatePath("/dashboard");
}

export async function deleteListAction(listId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await deleteList(listId, session.user.id);
  revalidatePath("/dashboard");
}

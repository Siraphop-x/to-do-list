"use server";

import { auth } from "@/lib/auth";
import { tagSchema } from "@/lib/validations";
import { createTag, deleteTag } from "@/services/tag.service";
import { revalidatePath } from "next/cache";

export async function createTagAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = { name: formData.get("name") as string };

  const parsed = tagSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await createTag(session.user.id, parsed.data.name);
  revalidatePath("/dashboard");
}

export async function deleteTagAction(tagId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await deleteTag(tagId, session.user.id);
  revalidatePath("/dashboard");
}

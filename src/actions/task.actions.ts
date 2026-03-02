"use server";

import { auth } from "@/lib/auth";
import { taskSchema } from "@/lib/validations";
import { createTask, toggleTask, deleteTask } from "@/services/task.service";
import { revalidatePath } from "next/cache";

export async function createTaskAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = {
    title: formData.get("title") as string,
    timeGroup: (formData.get("timeGroup") as string) || "today",
    listId: (formData.get("listId") as string) || undefined,
  };

  const parsed = taskSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await createTask(
    session.user.id,
    parsed.data.title,
    parsed.data.timeGroup || "today",
    parsed.data.listId
  );

  revalidatePath("/dashboard");
}

export async function toggleTaskAction(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await toggleTask(taskId, session.user.id);
  revalidatePath("/dashboard");
}

export async function deleteTaskAction(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await deleteTask(taskId, session.user.id);
  revalidatePath("/dashboard");
}

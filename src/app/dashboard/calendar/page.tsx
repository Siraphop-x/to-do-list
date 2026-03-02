import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTasksByUserId } from "@/services/task.service";
import CalendarView from "@/components/CalendarView";

export default async function CalendarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const tasks = await getTasksByUserId(session.user.id);

  const calendarTasks = tasks
    .filter((t: typeof tasks[0]) => t.dueDate)
    .map((t: typeof tasks[0]) => ({
      id: t.id,
      title: t.title,
      dueDate: t.dueDate!.toISOString(),
      completed: t.completed,
      list: t.list ? { name: t.list.name, color: t.list.color } : null,
    }));

  return <CalendarView tasks={calendarTasks} />;
}

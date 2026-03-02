import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTodayTasks } from "@/services/task.service";
import TaskItem from "@/components/TaskItem";
import AddTaskInput from "@/components/AddTaskInput";

export default async function TodayPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const tasks = await getTodayTasks(session.user.id);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Today</h1>
        <span className="rounded-lg bg-gray-100 px-3 py-1 text-lg font-semibold text-gray-600">
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="rounded-xl bg-white shadow-sm">
        <AddTaskInput timeGroup="today" />
        {tasks.map((task: typeof tasks[0]) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

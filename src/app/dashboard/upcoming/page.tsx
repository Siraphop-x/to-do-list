import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUpcomingTasks } from "@/services/task.service";
import TaskItem from "@/components/TaskItem";
import AddTaskInput from "@/components/AddTaskInput";

export default async function UpcomingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { today, tomorrow, thisWeek, total } = await getUpcomingTasks(session.user.id);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Upcoming</h1>
        <span className="rounded-lg bg-gray-100 px-3 py-1 text-lg font-semibold text-gray-600">
          {total}
        </span>
      </div>

      {/* Today Section */}
      <div className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-gray-800">Today</h2>
        <div className="rounded-xl bg-white shadow-sm">
          <AddTaskInput timeGroup="today" />
          {today.map((task: typeof today[0]) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* Tomorrow & This Week */}
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-bold text-gray-800">Tomorrow</h2>
          <div className="rounded-xl bg-white shadow-sm">
            <AddTaskInput timeGroup="tomorrow" />
            {tomorrow.map((task: typeof tomorrow[0]) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-lg font-bold text-gray-800">This Week</h2>
          <div className="rounded-xl bg-white shadow-sm">
            <AddTaskInput timeGroup="this_week" />
            {thisWeek.map((task: typeof thisWeek[0]) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

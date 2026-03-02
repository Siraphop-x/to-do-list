import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getListsByUserId } from "@/services/list.service";
import { getTagsByUserId } from "@/services/tag.service";
import { getTaskCountByUserId } from "@/services/task.service";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [lists, tags, taskCounts] = await Promise.all([
    getListsByUserId(session.user.id),
    getTagsByUserId(session.user.id),
    getTaskCountByUserId(session.user.id),
  ]);

  return (
    <div className="flex min-h-screen bg-[#F4F7F6]">
      <Sidebar
        lists={lists as { id: string; name: string; color: string; _count: { tasks: number } }[]}
        tags={tags}
        taskCounts={taskCounts}
      />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-12">
          {children}
        </div>
      </main>
    </div>
  );
}

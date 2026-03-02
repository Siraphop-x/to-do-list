import { prisma } from "@/lib/prisma";

export async function getTasksByUserId(userId: string) {
  return prisma.task.findMany({
    where: { userId },
    include: { subtasks: true, list: true, tags: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getTasksByTimeGroup(userId: string, timeGroup: string) {
  return prisma.task.findMany({
    where: { userId, timeGroup },
    include: { subtasks: true, list: true, tags: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getTodayTasks(userId: string) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  return prisma.task.findMany({
    where: {
      userId,
      OR: [
        { timeGroup: "today" },
        { dueDate: { gte: startOfDay, lt: endOfDay } },
      ],
    },
    include: { subtasks: true, list: true, tags: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getUpcomingTasks(userId: string) {
  const tasks = await prisma.task.findMany({
    where: { userId, completed: false },
    include: { subtasks: true, list: true, tags: true },
    orderBy: { createdAt: "asc" },
  });

  const today = tasks.filter((t: typeof tasks[0]) => t.timeGroup === "today");
  const tomorrow = tasks.filter((t: typeof tasks[0]) => t.timeGroup === "tomorrow");
  const thisWeek = tasks.filter((t: typeof tasks[0]) => t.timeGroup === "this_week");

  return { today, tomorrow, thisWeek, total: tasks.length };
}

export async function createTask(
  userId: string,
  title: string,
  timeGroup: string = "today",
  listId?: string,
  dueDate?: Date
) {
  return prisma.task.create({
    data: { userId, title, timeGroup, listId: listId || null, dueDate },
    include: { subtasks: true, list: true, tags: true },
  });
}

export async function toggleTask(taskId: string, userId: string) {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!task) throw new Error("Task not found");
  return prisma.task.update({
    where: { id: taskId },
    data: { completed: !task.completed },
  });
}

export async function deleteTask(taskId: string, userId: string) {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!task) throw new Error("Task not found");
  return prisma.task.delete({ where: { id: taskId } });
}

export async function getTaskCountByUserId(userId: string) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const [upcoming, today] = await Promise.all([
    prisma.task.count({ where: { userId, completed: false } }),
    prisma.task.count({
      where: {
        userId,
        completed: false,
        OR: [
          { timeGroup: "today" },
          { dueDate: { gte: startOfDay, lt: endOfDay } },
        ],
      },
    }),
  ]);

  return { upcoming, today };
}

export async function getTaskCountByListId(listId: string) {
  return prisma.task.count({ where: { listId, completed: false } });
}

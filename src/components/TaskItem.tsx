"use client";

import { toggleTaskAction, deleteTaskAction } from "@/actions/task.actions";
import { ChevronRight, CalendarDays, Trash2 } from "lucide-react";
import { useTransition } from "react";

type SubtaskType = {
  id: string;
  title: string;
  completed: boolean;
};

type ListType = {
  id: string;
  name: string;
  color: string;
} | null;

type TagType = {
  id: string;
  name: string;
};

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    completed: boolean;
    dueDate: Date | string | null;
    subtasks: SubtaskType[];
    list: ListType;
    tags: TagType[];
  };
}

export default function TaskItem({ task }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(() => {
      toggleTaskAction(task.id);
    });
  };

  const handleDelete = () => {
    startTransition(() => {
      deleteTaskAction(task.id);
    });
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, "-");
  };

  return (
    <div
      className={`group flex items-center justify-between border-b border-gray-50 px-4 py-3 transition hover:bg-gray-50/50 ${
        isPending ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={handleToggle}
          className={`h-5 w-5 flex-shrink-0 rounded-full border-2 transition ${
            task.completed
              ? "border-green-400 bg-green-400"
              : "border-gray-300 hover:border-gray-400"
          }`}
        />
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm ${
              task.completed
                ? "text-gray-400 line-through"
                : "text-gray-700"
            }`}
          >
            {task.title}
          </p>
          {(task.dueDate || task.subtasks.length > 0 || task.list || task.tags.length > 0) && (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {task.dueDate && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <CalendarDays className="h-3 w-3" />
                  {formatDate(task.dueDate)}
                </span>
              )}
              {task.subtasks.length > 0 && (
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                  {task.subtasks.filter((s) => s.completed).length} Subtasks
                </span>
              )}
              {task.list && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <span
                    className="h-2.5 w-2.5 rounded"
                    style={{ backgroundColor: task.list.color }}
                  />
                  {task.list.name}
                </span>
              )}
              {task.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          className="hidden group-hover:block p-1 text-gray-300 hover:text-red-400 transition"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <ChevronRight className="h-4 w-4 text-gray-300" />
      </div>
    </div>
  );
}

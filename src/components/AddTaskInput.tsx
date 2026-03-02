"use client";

import { createTaskAction } from "@/actions/task.actions";
import { Plus } from "lucide-react";
import { useRef } from "react";

interface AddTaskInputProps {
  timeGroup: string;
}

export default function AddTaskInput({ timeGroup }: AddTaskInputProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createTaskAction(formData);
        formRef.current?.reset();
      }}
      className="flex items-center gap-3 border-b border-gray-50 px-4 py-3"
    >
      <Plus className="h-4 w-4 text-gray-400" />
      <input type="hidden" name="timeGroup" value={timeGroup} />
      <input
        name="title"
        placeholder="Add New Task"
        className="flex-1 bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-400"
      />
    </form>
  );
}

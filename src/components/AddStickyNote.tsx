"use client";

import { createStickyNoteAction } from "@/actions/sticky-note.actions";
import { Plus } from "lucide-react";
import { useState, useRef } from "react";

const colors = [
  { value: "yellow", bg: "#FFF9C4" },
  { value: "cyan", bg: "#D4F5F5" },
  { value: "pink", bg: "#FCE4EC" },
  { value: "orange", bg: "#FFE0B2" },
];

export default function AddStickyNote() {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedColor, setSelectedColor] = useState("yellow");
  const formRef = useRef<HTMLFormElement>(null);

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="flex min-h-[200px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white transition hover:border-gray-300 hover:bg-gray-50"
      >
        <Plus className="h-10 w-10 text-gray-300" />
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createStickyNoteAction(formData);
        formRef.current?.reset();
        setIsAdding(false);
      }}
      className="flex min-h-[200px] flex-col rounded-2xl p-5"
      style={{ backgroundColor: colors.find((c) => c.value === selectedColor)?.bg || "#FFF9C4" }}
    >
      <input type="hidden" name="color" value={selectedColor} />
      <input
        name="title"
        autoFocus
        placeholder="Title"
        className="mb-2 bg-transparent text-base font-bold text-gray-800 outline-none placeholder:text-gray-500"
      />
      <textarea
        name="content"
        placeholder="Write your note..."
        className="mb-3 flex-1 resize-none bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-400"
        rows={4}
      />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setSelectedColor(c.value)}
              className={`h-5 w-5 rounded-full border-2 transition ${
                selectedColor === c.value ? "border-gray-500 scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c.bg }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="rounded-lg px-3 py-1 text-xs text-gray-500 hover:bg-black/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-gray-800 px-3 py-1 text-xs text-white hover:bg-gray-700"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

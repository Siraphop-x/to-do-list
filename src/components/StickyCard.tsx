"use client";

import { updateStickyNoteAction, deleteStickyNoteAction } from "@/actions/sticky-note.actions";
import { Trash2 } from "lucide-react";
import { useTransition, useState } from "react";

const colorMap: Record<string, string> = {
  yellow: "#FFF9C4",
  cyan: "#D4F5F5",
  pink: "#FCE4EC",
  orange: "#FFE0B2",
};

interface StickyCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    color: string;
  };
}

export default function StickyCard({ note }: StickyCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const bgColor = colorMap[note.color] || colorMap.yellow;

  const handleSave = () => {
    setIsEditing(false);
    const formData = new FormData();
    formData.set("title", title);
    formData.set("content", content);
    formData.set("color", note.color);
    startTransition(() => {
      updateStickyNoteAction(note.id, formData);
    });
  };

  const handleDelete = () => {
    startTransition(() => {
      deleteStickyNoteAction(note.id);
    });
  };

  return (
    <div
      className={`group relative rounded-2xl p-5 min-h-[200px] flex flex-col transition ${
        isPending ? "opacity-50" : ""
      }`}
      style={{ backgroundColor: bgColor }}
    >
      <button
        onClick={handleDelete}
        className="absolute right-3 top-3 hidden group-hover:block p-1 rounded-full hover:bg-black/5 transition"
      >
        <Trash2 className="h-4 w-4 text-gray-500" />
      </button>

      {isEditing ? (
        <>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            autoFocus
            className="mb-2 bg-transparent text-base font-bold text-gray-800 outline-none"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleSave}
            className="flex-1 resize-none bg-transparent text-sm text-gray-600 outline-none"
            rows={5}
          />
        </>
      ) : (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer flex-1">
          <h3 className="mb-2 text-base font-bold text-gray-800">{note.title}</h3>
          <p className="whitespace-pre-wrap text-sm text-gray-600 leading-relaxed">
            {note.content}
          </p>
        </div>
      )}
    </div>
  );
}

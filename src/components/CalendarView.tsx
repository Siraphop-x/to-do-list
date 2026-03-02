"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CalendarTask = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  list: { name: string; color: string } | null;
};

interface CalendarViewProps {
  tasks: CalendarTask[];
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);

const dayColorMap: Record<string, string> = {
  default: "#E8F4FD",
  pink: "#FCE4EC",
  cyan: "#D4F5F5",
};

function formatTime(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour > 12 ? hour - 12 : hour;
  return `${display.toString().padStart(2, "0")}:00\n${suffix}`;
}

export default function CalendarView({ tasks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"Day" | "Week" | "Month">("Day");

  const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const dateStr = currentDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const goBack = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const goForward = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const dayTasks = tasks.filter((t) => {
    const td = new Date(t.dueDate);
    return (
      td.getFullYear() === currentDate.getFullYear() &&
      td.getMonth() === currentDate.getMonth() &&
      td.getDate() === currentDate.getDate()
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{dateStr}</h1>
        <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Add Event
        </button>
      </div>

      {/* View toggle & nav */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {(["Day", "Week", "Month"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 text-sm font-medium transition ${
                view === v
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </button>
          <button onClick={goForward} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Day label */}
      <p className="mb-4 text-xs font-semibold tracking-wider text-gray-400">{dayName}</p>

      {/* Timeline */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        {HOURS.map((hour) => {
          const hourTasks = dayTasks.filter((t) => {
            const td = new Date(t.dueDate);
            return td.getHours() === hour;
          });

          return (
            <div key={hour} className="flex border-b border-gray-50 min-h-[64px]">
              <div className="w-16 flex-shrink-0 py-3 pr-3 text-right">
                <span className="whitespace-pre-line text-xs text-gray-400">
                  {formatTime(hour)}
                </span>
              </div>
              <div className="flex-1 py-2 px-2 space-y-1">
                {hourTasks.map((task) => {
                  const bg = task.list?.color
                    ? task.list.color === "#C74B4B"
                      ? dayColorMap.pink
                      : task.list.color === "#4BC7C7"
                      ? dayColorMap.cyan
                      : dayColorMap.default
                    : dayColorMap.default;

                  return (
                    <div
                      key={task.id}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700"
                      style={{ backgroundColor: bg }}
                    >
                      {task.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

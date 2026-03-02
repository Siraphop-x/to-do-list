"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronsRight,
  ListTodo,
  CalendarDays,
  StickyNote,
  Settings,
  LogOut,
  Plus,
  Search,
  Menu,
  X,
} from "lucide-react";
import { signOutAction } from "@/actions/auth.actions";
import { createListAction } from "@/actions/list.actions";
import { createTagAction } from "@/actions/tag.actions";
import { useState } from "react";

type ListItem = {
  id: string;
  name: string;
  color: string;
  _count: { tasks: number };
};

type TagItem = {
  id: string;
  name: string;
};

type TaskCounts = {
  upcoming: number;
  today: number;
};

interface SidebarProps {
  lists: ListItem[];
  tags: TagItem[];
  taskCounts: TaskCounts;
}

const navItems = [
  { href: "/dashboard/upcoming", label: "Upcoming", icon: ChevronsRight },
  { href: "/dashboard/today", label: "Today", icon: ListTodo },
  { href: "/dashboard/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/dashboard/sticky-wall", label: "Sticky Wall", icon: StickyNote },
];

export default function Sidebar({ lists, tags, taskCounts }: SidebarProps) {
  const pathname = usePathname();
  const [showAddList, setShowAddList] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const getCount = (href: string) => {
    if (href.includes("upcoming")) return taskCounts.upcoming;
    if (href.includes("today")) return taskCounts.today;
    return null;
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <h1 className="text-xl font-bold text-gray-900 italic">Menu</h1>
        <button
          className="lg:hidden text-gray-400 hover:text-gray-600"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
        <Menu className="hidden lg:block h-5 w-5 text-gray-400" />
      </div>

      {/* Search */}
      <div className="px-6 py-3">
        <div className="flex items-center gap-2 rounded-lg bg-[#F4F7F6] px-3 py-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Tasks Nav */}
      <div className="px-6 pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Tasks
        </p>
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const count = getCount(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-[#F4F7F6] font-semibold text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                {count !== null && (
                  <span className={`text-xs ${isActive ? "rounded bg-gray-200 px-2 py-0.5 font-bold" : "text-gray-400"}`}>
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Divider */}
      <div className="mx-6 my-4 border-t border-gray-100" />

      {/* Lists */}
      <div className="px-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Lists
        </p>
        <div className="space-y-0.5">
          {lists.map((list) => (
            <div
              key={list.id}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              <span className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded"
                  style={{ backgroundColor: list.color }}
                />
                {list.name}
              </span>
              <span className="text-xs text-gray-400">{list._count.tasks}</span>
            </div>
          ))}

          {showAddList ? (
            <form
              action={async (formData) => {
                await createListAction(formData);
                setShowAddList(false);
              }}
              className="flex items-center gap-2 px-3 py-1"
            >
              <input
                name="name"
                autoFocus
                placeholder="List name"
                className="flex-1 rounded border border-gray-200 px-2 py-1 text-sm outline-none focus:border-gray-400"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setShowAddList(false);
                }}
              />
              <input type="hidden" name="color" value="#C74B4B" />
            </form>
          ) : (
            <button
              onClick={() => setShowAddList(true)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-gray-600"
            >
              <Plus className="h-4 w-4" />
              Add New List
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 my-4 border-t border-gray-100" />

      {/* Tags */}
      <div className="px-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Tags
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-[#F4F7F6] px-3 py-1 text-xs font-medium text-gray-600"
            >
              {tag.name}
            </span>
          ))}
          {showAddTag ? (
            <form
              action={async (formData) => {
                await createTagAction(formData);
                setShowAddTag(false);
              }}
            >
              <input
                name="name"
                autoFocus
                placeholder="Tag name"
                className="rounded-full border border-gray-200 px-3 py-1 text-xs outline-none focus:border-gray-400"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setShowAddTag(false);
                }}
              />
            </form>
          ) : (
            <button
              onClick={() => setShowAddTag(true)}
              className="rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs text-gray-400 hover:border-gray-400 hover:text-gray-600"
            >
              + Add Tag
            </button>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="border-t border-gray-100 px-6 py-4 space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-white p-2 shadow-md lg:hidden"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 min-h-screen border-r border-gray-100">
        {sidebarContent}
      </aside>
    </>
  );
}

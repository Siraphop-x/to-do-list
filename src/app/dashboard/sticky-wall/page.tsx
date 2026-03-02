import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStickyNotesByUserId } from "@/services/sticky-note.service";
import StickyCard from "@/components/StickyCard";
import AddStickyNote from "@/components/AddStickyNote";

export default async function StickyWallPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const notes = await getStickyNotesByUserId(session.user.id);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sticky Wall</h1>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note: typeof notes[0]) => (
          <StickyCard key={note.id} note={note} />
        ))}
        <AddStickyNote />
      </div>
    </div>
  );
}

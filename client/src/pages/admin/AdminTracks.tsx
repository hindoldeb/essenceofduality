import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

type Track = { id?: number; trackNumber: number; titleEn: string; titleDe: string; ragaEn: string; ragaDe: string; subtitleEn?: string; subtitleDe?: string; duration: string; sortOrder: number };
const empty: Track = { trackNumber: 1, titleEn: "", titleDe: "", ragaEn: "", ragaDe: "", subtitleEn: "", subtitleDe: "", duration: "", sortOrder: 0 };

export default function AdminTracks() {
  const { data: tracks = [], refetch } = trpc.content.getTracks.useQuery();
  const upsert = trpc.admin.upsertTrack.useMutation({ onSuccess: () => { refetch(); setEditing(null); toast.success("Saved!"); } });
  const del = trpc.admin.deleteTrack.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });
  const [editing, setEditing] = useState<Track | null>(null);

  const Field = ({ label, value, onChange, half }: { label: string; value: string; onChange: (v: string) => void; half?: boolean }) => (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="font-mono text-xs text-cream-dim/50 uppercase tracking-widest block mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-input border border-border text-foreground text-sm p-2.5 focus:outline-none focus:border-gold/50 transition-colors" />
    </div>
  );

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-1">Tracks</h1>
          <p className="text-cream-dim/60 font-mono text-xs">{tracks.length} tracks</p>
        </div>
        <button onClick={() => setEditing({ ...empty, sortOrder: tracks.length })}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-mono text-xs font-bold tracking-widest hover:opacity-90 transition-all">
          <Plus size={14} /> Add Track
        </button>
      </div>

      {editing && (
        <div className="border border-gold/30 p-6 bg-card mb-6">
          <h2 className="font-mono text-xs text-gold/70 uppercase tracking-widest mb-4">{editing.id ? "Edit Track" : "New Track"}</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field label="Track Number" value={String(editing.trackNumber)} onChange={(v) => setEditing({ ...editing, trackNumber: Number(v) })} half />
            <Field label="Duration" value={editing.duration} onChange={(v) => setEditing({ ...editing, duration: v })} half />
            <Field label="Title (EN)" value={editing.titleEn} onChange={(v) => setEditing({ ...editing, titleEn: v })} half />
            <Field label="Title (DE)" value={editing.titleDe} onChange={(v) => setEditing({ ...editing, titleDe: v })} half />
            <Field label="Raga (EN)" value={editing.ragaEn} onChange={(v) => setEditing({ ...editing, ragaEn: v })} half />
            <Field label="Raga (DE)" value={editing.ragaDe} onChange={(v) => setEditing({ ...editing, ragaDe: v })} half />
            <Field label="Subtitle (EN)" value={editing.subtitleEn || ""} onChange={(v) => setEditing({ ...editing, subtitleEn: v })} half />
            <Field label="Subtitle (DE)" value={editing.subtitleDe || ""} onChange={(v) => setEditing({ ...editing, subtitleDe: v })} half />
            <Field label="Sort Order" value={String(editing.sortOrder)} onChange={(v) => setEditing({ ...editing, sortOrder: Number(v) })} half />
          </div>
          <div className="flex gap-3">
            <button onClick={() => upsert.mutate(editing)}
              className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-mono text-xs font-bold hover:opacity-90 transition-all">
              <Check size={12} /> Save
            </button>
            <button onClick={() => setEditing(null)}
              className="flex items-center gap-2 px-4 py-2 border border-border text-cream-dim font-mono text-xs hover:border-gold/30 transition-all">
              <X size={12} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {tracks.map((t) => (
          <div key={t.id} className="flex items-center gap-4 p-4 border border-gold/10 hover:border-gold/25 bg-card transition-all">
            <span className="font-mono text-xs text-gold/40 w-6">{String(t.trackNumber).padStart(2, "0")}</span>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-cream">{t.titleEn} <span className="text-cream-dim/40 text-sm">/ {t.titleDe}</span></p>
              <p className="font-mono text-xs text-gold/40">{t.ragaEn}</p>
            </div>
            <span className="font-mono text-xs text-cream-dim/50">{t.duration}</span>
            <div className="flex gap-2">
              <button onClick={() => setEditing(t as Track)}
                className="p-1.5 text-cream-dim/40 hover:text-gold transition-colors"><Pencil size={13} /></button>
              <button onClick={() => { if (confirm("Delete this track?")) del.mutate({ id: t.id }); }}
                className="p-1.5 text-cream-dim/40 hover:text-destructive transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

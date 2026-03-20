import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

type Raga = { id?: number; ragaName: string; trackTitleEn: string; trackTitleDe: string; descriptionEn: string; descriptionDe: string; sortOrder: number };
const empty: Raga = { ragaName: "", trackTitleEn: "", trackTitleDe: "", descriptionEn: "", descriptionDe: "", sortOrder: 0 };

export default function AdminRagas() {
  const { data: ragas = [], refetch } = trpc.content.getRagaDescriptions.useQuery();
  const upsert = trpc.admin.upsertRagaDescription.useMutation({ onSuccess: () => { refetch(); setEditing(null); toast.success("Saved!"); } });
  const del = trpc.admin.deleteRagaDescription.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });
  const [editing, setEditing] = useState<Raga | null>(null);

  const TF = ({ label, value, onChange, multi }: { label: string; value: string; onChange: (v: string) => void; multi?: boolean }) => (
    <div>
      <label className="font-mono text-xs text-cream-dim/50 uppercase tracking-widest block mb-1">{label}</label>
      {multi ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
          className="w-full bg-input border border-border text-foreground text-sm p-2.5 resize-y focus:outline-none focus:border-gold/50 transition-colors" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full bg-input border border-border text-foreground text-sm p-2.5 focus:outline-none focus:border-gold/50 transition-colors" />
      )}
    </div>
  );

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-1">Raga Descriptions</h1>
          <p className="text-cream-dim/60 font-mono text-xs">{ragas.length} ragas</p>
        </div>
        <button onClick={() => setEditing({ ...empty, sortOrder: ragas.length })}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-mono text-xs font-bold hover:opacity-90 transition-all">
          <Plus size={14} /> Add Raga
        </button>
      </div>

      {editing && (
        <div className="border border-gold/30 p-6 bg-card mb-6">
          <h2 className="font-mono text-xs text-gold/70 uppercase tracking-widest mb-4">{editing.id ? "Edit Raga" : "New Raga"}</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <TF label="Raga Name" value={editing.ragaName} onChange={(v) => setEditing({ ...editing, ragaName: v })} />
            <TF label="Sort Order" value={String(editing.sortOrder)} onChange={(v) => setEditing({ ...editing, sortOrder: Number(v) })} />
            <TF label="Track Title (EN)" value={editing.trackTitleEn} onChange={(v) => setEditing({ ...editing, trackTitleEn: v })} />
            <TF label="Track Title (DE)" value={editing.trackTitleDe} onChange={(v) => setEditing({ ...editing, trackTitleDe: v })} />
            <TF label="Description (EN)" value={editing.descriptionEn} onChange={(v) => setEditing({ ...editing, descriptionEn: v })} multi />
            <TF label="Description (DE)" value={editing.descriptionDe} onChange={(v) => setEditing({ ...editing, descriptionDe: v })} multi />
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

      <div className="space-y-3">
        {ragas.map((r) => (
          <div key={r.id} className="flex items-start gap-4 p-4 border border-gold/10 hover:border-gold/25 bg-card transition-all">
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs text-gold/60 uppercase tracking-widest mb-1">{r.ragaName}</p>
              <p className="font-serif text-cream">{r.trackTitleEn}</p>
              <p className="text-cream-dim/50 text-sm mt-1 line-clamp-2">{r.descriptionEn}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(r as Raga)}
                className="p-1.5 text-cream-dim/40 hover:text-gold transition-colors"><Pencil size={13} /></button>
              <button onClick={() => { if (confirm("Delete?")) del.mutate({ id: r.id }); }}
                className="p-1.5 text-cream-dim/40 hover:text-destructive transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

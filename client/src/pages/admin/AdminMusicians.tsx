import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

type Musician = { id?: number; nameEn: string; nameDe: string; roleEn: string; roleDe: string; bioEn: string; bioDe: string; imageUrl?: string; sortOrder: number };
const empty: Musician = { nameEn: "", nameDe: "", roleEn: "", roleDe: "", bioEn: "", bioDe: "", imageUrl: "", sortOrder: 0 };

export default function AdminMusicians() {
  const { data: musicians = [], refetch } = trpc.content.getMusicians.useQuery();
  const upsert = trpc.admin.upsertMusician.useMutation({ onSuccess: () => { refetch(); setEditing(null); toast.success("Saved!"); } });
  const del = trpc.admin.deleteMusician.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });
  const [editing, setEditing] = useState<Musician | null>(null);

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
          <h1 className="font-serif text-3xl text-cream mb-1">Musicians</h1>
          <p className="text-cream-dim/60 font-mono text-xs">{musicians.length} musicians</p>
        </div>
        <button onClick={() => setEditing({ ...empty, sortOrder: musicians.length })}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-mono text-xs font-bold hover:opacity-90 transition-all">
          <Plus size={14} /> Add Musician
        </button>
      </div>

      {editing && (
        <div className="border border-gold/30 p-6 bg-card mb-6">
          <h2 className="font-mono text-xs text-gold/70 uppercase tracking-widest mb-4">{editing.id ? "Edit Musician" : "New Musician"}</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <TF label="Name (EN)" value={editing.nameEn} onChange={(v) => setEditing({ ...editing, nameEn: v })} />
            <TF label="Name (DE)" value={editing.nameDe} onChange={(v) => setEditing({ ...editing, nameDe: v })} />
            <TF label="Role (EN)" value={editing.roleEn} onChange={(v) => setEditing({ ...editing, roleEn: v })} />
            <TF label="Role (DE)" value={editing.roleDe} onChange={(v) => setEditing({ ...editing, roleDe: v })} />
            <TF label="Bio (EN)" value={editing.bioEn} onChange={(v) => setEditing({ ...editing, bioEn: v })} multi />
            <TF label="Bio (DE)" value={editing.bioDe} onChange={(v) => setEditing({ ...editing, bioDe: v })} multi />
          </div>
          <div className="mb-4">
            <label className="font-mono text-xs text-cream-dim/50 uppercase tracking-widest block mb-2">Photo</label>
            <ImageUpload currentUrl={editing.imageUrl} onUploaded={(url) => setEditing({ ...editing, imageUrl: url })} />
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
        {musicians.map((m) => (
          <div key={m.id} className="flex items-center gap-4 p-4 border border-gold/10 hover:border-gold/25 bg-card transition-all">
            {m.imageUrl && <img src={m.imageUrl} alt={m.nameEn} className="w-12 h-12 object-cover shrink-0 grayscale" />}
            <div className="flex-1 min-w-0">
              <p className="font-serif text-cream">{m.nameEn}</p>
              <p className="font-mono text-xs text-gold/40">{m.roleEn}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(m as Musician)}
                className="p-1.5 text-cream-dim/40 hover:text-gold transition-colors"><Pencil size={13} /></button>
              <button onClick={() => { if (confirm("Delete?")) del.mutate({ id: m.id }); }}
                className="p-1.5 text-cream-dim/40 hover:text-destructive transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

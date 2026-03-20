import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

type Link = { id?: number; platform: string; url: string; iconKey?: string; sortOrder: number; isActive: boolean };
const empty: Link = { platform: "", url: "", iconKey: "", sortOrder: 0, isActive: true };

export default function AdminStreaming() {
  const { data: links = [], refetch } = trpc.content.getStreamingLinks.useQuery();
  const upsert = trpc.admin.upsertStreamingLink.useMutation({ onSuccess: () => { refetch(); setEditing(null); toast.success("Saved!"); } });
  const del = trpc.admin.deleteStreamingLink.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });
  const [editing, setEditing] = useState<Link | null>(null);

  const TF = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div>
      <label className="font-mono text-xs text-cream-dim/50 uppercase tracking-widest block mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-input border border-border text-foreground text-sm p-2.5 focus:outline-none focus:border-gold/50 transition-colors" />
    </div>
  );

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-1">Streaming Links</h1>
          <p className="text-cream-dim/60 font-mono text-xs">{links.length} platforms</p>
        </div>
        <button onClick={() => setEditing({ ...empty, sortOrder: links.length })}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-mono text-xs font-bold hover:opacity-90 transition-all">
          <Plus size={14} /> Add Link
        </button>
      </div>

      {editing && (
        <div className="border border-gold/30 p-6 bg-card mb-6">
          <h2 className="font-mono text-xs text-gold/70 uppercase tracking-widest mb-4">{editing.id ? "Edit Link" : "New Link"}</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <TF label="Platform Name" value={editing.platform} onChange={(v) => setEditing({ ...editing, platform: v })} />
            <TF label="URL" value={editing.url} onChange={(v) => setEditing({ ...editing, url: v })} />
            <TF label="Sort Order" value={String(editing.sortOrder)} onChange={(v) => setEditing({ ...editing, sortOrder: Number(v) })} />
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="isActive" checked={editing.isActive} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                className="accent-gold" />
              <label htmlFor="isActive" className="font-mono text-xs text-cream-dim/70">Active (visible on site)</label>
            </div>
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
        {links.map((l) => (
          <div key={l.id} className="flex items-center gap-4 p-4 border border-gold/10 hover:border-gold/25 bg-card transition-all">
            <div className="flex-1 min-w-0">
              <p className="font-serif text-cream">{l.platform}</p>
              <p className="font-mono text-xs text-cream-dim/40 truncate">{l.url}</p>
            </div>
            <span className={`font-mono text-xs px-2 py-0.5 ${l.isActive ? "text-gold/70 bg-gold/10" : "text-cream-dim/30 bg-white/5"}`}>
              {l.isActive ? "active" : "hidden"}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setEditing(l as Link)}
                className="p-1.5 text-cream-dim/40 hover:text-gold transition-colors"><Pencil size={13} /></button>
              <button onClick={() => { if (confirm("Delete?")) del.mutate({ id: l.id }); }}
                className="p-1.5 text-cream-dim/40 hover:text-destructive transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

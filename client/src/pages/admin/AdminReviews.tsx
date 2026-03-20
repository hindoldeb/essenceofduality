import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

type Review = { id?: number; publicationEn: string; publicationDe: string; reviewerEn?: string; reviewerDe?: string; quoteEn: string; quoteDe: string; dateEn?: string; dateDe?: string; rating: number; sourceUrl?: string; sortOrder: number };
const empty: Review = { publicationEn: "", publicationDe: "", reviewerEn: "", reviewerDe: "", quoteEn: "", quoteDe: "", dateEn: "", dateDe: "", rating: 4, sourceUrl: "", sortOrder: 0 };

export default function AdminReviews() {
  const { data: reviews = [], refetch } = trpc.content.getPressReviews.useQuery();
  const upsert = trpc.admin.upsertPressReview.useMutation({ onSuccess: () => { refetch(); setEditing(null); toast.success("Saved!"); } });
  const del = trpc.admin.deletePressReview.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });
  const [editing, setEditing] = useState<Review | null>(null);

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
          <h1 className="font-serif text-3xl text-cream mb-1">Press Reviews</h1>
          <p className="text-cream-dim/60 font-mono text-xs">{reviews.length} reviews</p>
        </div>
        <button onClick={() => setEditing({ ...empty, sortOrder: reviews.length })}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-mono text-xs font-bold hover:opacity-90 transition-all">
          <Plus size={14} /> Add Review
        </button>
      </div>

      {editing && (
        <div className="border border-gold/30 p-6 bg-card mb-6">
          <h2 className="font-mono text-xs text-gold/70 uppercase tracking-widest mb-4">{editing.id ? "Edit Review" : "New Review"}</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <TF label="Publication (EN)" value={editing.publicationEn} onChange={(v) => setEditing({ ...editing, publicationEn: v })} />
            <TF label="Publication (DE)" value={editing.publicationDe} onChange={(v) => setEditing({ ...editing, publicationDe: v })} />
            <TF label="Reviewer (EN)" value={editing.reviewerEn || ""} onChange={(v) => setEditing({ ...editing, reviewerEn: v })} />
            <TF label="Reviewer (DE)" value={editing.reviewerDe || ""} onChange={(v) => setEditing({ ...editing, reviewerDe: v })} />
            <TF label="Quote (EN)" value={editing.quoteEn} onChange={(v) => setEditing({ ...editing, quoteEn: v })} multi />
            <TF label="Quote (DE)" value={editing.quoteDe} onChange={(v) => setEditing({ ...editing, quoteDe: v })} multi />
            <TF label="Date (EN)" value={editing.dateEn || ""} onChange={(v) => setEditing({ ...editing, dateEn: v })} />
            <TF label="Date (DE)" value={editing.dateDe || ""} onChange={(v) => setEditing({ ...editing, dateDe: v })} />
            <TF label="Source URL" value={editing.sourceUrl || ""} onChange={(v) => setEditing({ ...editing, sourceUrl: v })} />
            <div>
              <label className="font-mono text-xs text-cream-dim/50 uppercase tracking-widest block mb-1">Rating (0–5)</label>
              <input type="number" min={0} max={5} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
                className="w-full bg-input border border-border text-foreground text-sm p-2.5 focus:outline-none focus:border-gold/50 transition-colors" />
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

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="p-4 border border-gold/10 hover:border-gold/25 bg-card transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-serif text-cream">{r.publicationEn}</p>
                <p className="text-cream-dim/60 text-sm mt-1 line-clamp-2 italic">"{r.quoteEn}"</p>
                <p className="font-mono text-xs text-gold/40 mt-1">{"★".repeat(r.rating || 0)}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(r as Review)}
                  className="p-1.5 text-cream-dim/40 hover:text-gold transition-colors"><Pencil size={13} /></button>
                <button onClick={() => { if (confirm("Delete?")) del.mutate({ id: r.id }); }}
                  className="p-1.5 text-cream-dim/40 hover:text-destructive transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

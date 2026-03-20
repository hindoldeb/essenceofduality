import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

type GalleryImg = { id?: number; imageUrl: string; captionEn?: string; captionDe?: string; altEn?: string; altDe?: string; category: "concert" | "portrait" | "album" | "tour" | "other"; sortOrder: number };
const empty: GalleryImg = { imageUrl: "", captionEn: "", captionDe: "", altEn: "", altDe: "", category: "concert", sortOrder: 0 };

export default function AdminGallery() {
  const { data: gallery = [], refetch } = trpc.content.getGalleryImages.useQuery();
  const add = trpc.admin.addGalleryImage.useMutation({ onSuccess: () => { refetch(); setEditing(null); toast.success("Added!"); } });
  const update = trpc.admin.updateGalleryImage.useMutation({ onSuccess: () => { refetch(); setEditing(null); toast.success("Saved!"); } });
  const del = trpc.admin.deleteGalleryImage.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });
  const [editing, setEditing] = useState<GalleryImg | null>(null);

  const TF = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div>
      <label className="font-mono text-xs text-cream-dim/50 uppercase tracking-widest block mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-input border border-border text-foreground text-sm p-2.5 focus:outline-none focus:border-gold/50 transition-colors" />
    </div>
  );

  const handleSave = () => {
    if (!editing) return;
    if (!editing.imageUrl) { toast.error("Please upload an image first"); return; }
    if (editing.id) {
      update.mutate({ id: editing.id, captionEn: editing.captionEn, captionDe: editing.captionDe, altEn: editing.altEn, altDe: editing.altDe, category: editing.category, sortOrder: editing.sortOrder });
    } else {
      add.mutate(editing);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-1">Gallery</h1>
          <p className="text-cream-dim/60 font-mono text-xs">{gallery.length} images</p>
        </div>
        <button onClick={() => setEditing({ ...empty, sortOrder: gallery.length })}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-mono text-xs font-bold hover:opacity-90 transition-all">
          <Plus size={14} /> Add Image
        </button>
      </div>

      {editing && (
        <div className="border border-gold/30 p-6 bg-card mb-6">
          <h2 className="font-mono text-xs text-gold/70 uppercase tracking-widest mb-4">{editing.id ? "Edit Image" : "Upload New Image"}</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="font-mono text-xs text-cream-dim/50 uppercase tracking-widest block mb-2">Image</label>
              <ImageUpload currentUrl={editing.imageUrl} onUploaded={(url) => setEditing({ ...editing, imageUrl: url })} />
            </div>
            <div className="space-y-3">
              <TF label="Caption (EN)" value={editing.captionEn || ""} onChange={(v) => setEditing({ ...editing, captionEn: v })} />
              <TF label="Caption (DE)" value={editing.captionDe || ""} onChange={(v) => setEditing({ ...editing, captionDe: v })} />
              <TF label="Alt Text (EN)" value={editing.altEn || ""} onChange={(v) => setEditing({ ...editing, altEn: v })} />
              <TF label="Alt Text (DE)" value={editing.altDe || ""} onChange={(v) => setEditing({ ...editing, altDe: v })} />
              <div>
                <label className="font-mono text-xs text-cream-dim/50 uppercase tracking-widest block mb-1">Category</label>
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as GalleryImg["category"] })}
                  className="w-full bg-input border border-border text-foreground text-sm p-2.5 focus:outline-none focus:border-gold/50 transition-colors">
                  {["concert", "portrait", "album", "tour", "other"].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <TF label="Sort Order" value={String(editing.sortOrder)} onChange={(v) => setEditing({ ...editing, sortOrder: Number(v) })} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave}
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((img) => (
          <div key={img.id} className="relative group border border-gold/10 hover:border-gold/30 transition-all overflow-hidden">
            <img src={img.imageUrl} alt={img.altEn || ""} className="w-full aspect-[4/3] object-cover" />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              {img.captionEn && <p className="font-mono text-xs text-gold/80 mb-2 line-clamp-2">{img.captionEn}</p>}
              <div className="flex gap-2">
                <button onClick={() => setEditing(img as GalleryImg)}
                  className="p-1.5 bg-gold/20 text-gold hover:bg-gold/40 transition-colors rounded"><Pencil size={11} /></button>
                <button onClick={() => { if (confirm("Delete?")) del.mutate({ id: img.id }); }}
                  className="p-1.5 bg-destructive/20 text-destructive hover:bg-destructive/40 transition-colors rounded"><Trash2 size={11} /></button>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded">
              <span className="font-mono text-xs text-gold/50">{img.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

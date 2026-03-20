import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Eye, EyeOff, Save } from "lucide-react";

const defaultSections = [
  { key: "album", labelEn: "Album", labelDe: "Album", isVisible: true, sortOrder: 1 },
  { key: "tracklist", labelEn: "Tracklist", labelDe: "Titelliste", isVisible: true, sortOrder: 2 },
  { key: "musicians", labelEn: "Musicians", labelDe: "Musiker", isVisible: true, sortOrder: 3 },
  { key: "gallery", labelEn: "Gallery", labelDe: "Galerie", isVisible: true, sortOrder: 4 },
  { key: "reviews", labelEn: "Press Reviews", labelDe: "Pressekritiken", isVisible: true, sortOrder: 5 },
  { key: "ragas", labelEn: "Ragas", labelDe: "Ragas", isVisible: true, sortOrder: 6 },
  { key: "bio", labelEn: "Artist Bio", labelDe: "Künstlerbiografie", isVisible: true, sortOrder: 7 },
  { key: "tour", labelEn: "Tour Dates", labelDe: "Tourtermine", isVisible: true, sortOrder: 8 },
];

type Section = { key: string; labelEn: string; labelDe: string; isVisible: boolean; sortOrder: number };

export default function AdminSections() {
  const { data: dbSections = [], refetch } = trpc.content.getSections.useQuery();
  const upsert = trpc.admin.updateSection.useMutation({ onSuccess: () => { refetch(); toast.success("Saved!"); } });
  const [sections, setSections] = useState<Section[]>(defaultSections);

  useEffect(() => {
    if (dbSections.length > 0) {
      setSections(defaultSections.map((def) => {
        const db = dbSections.find((d) => d.key === def.key);
        return db ? { ...def, isVisible: db.isVisible, sortOrder: db.sortOrder } : def;
      }));
    }
  }, [dbSections]);

  const toggle = (key: string) => {
    setSections((prev) => prev.map((s) => s.key === key ? { ...s, isVisible: !s.isVisible } : s));
  };

  const saveAll = async () => {
    for (const s of sections) {
      await upsert.mutateAsync(s);
    }
    toast.success("All sections saved!");
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-1">Section Visibility</h1>
          <p className="text-cream-dim/60 font-mono text-xs">Toggle which sections appear on the public site</p>
        </div>
        <button onClick={saveAll}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-mono text-xs font-bold hover:opacity-90 transition-all">
          <Save size={14} /> Save All
        </button>
      </div>

      <div className="space-y-2">
        {sections.map((s) => (
          <div key={s.key} className="flex items-center gap-4 p-4 border border-gold/10 hover:border-gold/25 bg-card transition-all">
            <div className="flex-1">
              <p className="font-serif text-cream">{s.labelEn}</p>
              <p className="font-mono text-xs text-cream-dim/40">{s.labelDe}</p>
            </div>
            <button
              onClick={() => toggle(s.key)}
              className={`flex items-center gap-2 px-4 py-2 font-mono text-xs transition-all ${
                s.isVisible
                  ? "bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20"
                  : "bg-white/5 text-cream-dim/40 border border-border hover:border-gold/20"
              }`}
            >
              {s.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
              {s.isVisible ? "Visible" : "Hidden"}
            </button>
          </div>
        ))}
      </div>

      <p className="font-mono text-xs text-cream-dim/30 mt-6">
        Changes take effect immediately after saving. The hero, artist quote, and footer sections are always visible.
      </p>
    </div>
  );
}

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

type TourDate = { id?: number; dateStr: string; venueEn: string; venueDe: string; cityEn: string; cityDe: string; countryEn: string; countryDe: string; region: "germany" | "europe" | "india" | "other"; eventUrl?: string; sortOrder: number };
const empty: TourDate = { dateStr: "", venueEn: "", venueDe: "", cityEn: "", cityDe: "", countryEn: "", countryDe: "", region: "germany", eventUrl: "", sortOrder: 0 };

export default function AdminTourDates() {
  const { data: tourDates = [], refetch } = trpc.content.getTourDates.useQuery();
  const upsert = trpc.admin.upsertTourDate.useMutation({ onSuccess: () => { refetch(); setEditing(null); toast.success("Saved!"); } });
  const del = trpc.admin.deleteTourDate.useMutation({ onSuccess: () => { refetch(); toast.success("Deleted"); } });
  const [editing, setEditing] = useState<TourDate | null>(null);

  const TF = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div>
      <label className="font-mono text-xs text-cream-dim/50 uppercase tracking-widest block mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-input border border-border text-foreground text-sm p-2.5 focus:outline-none focus:border-gold/50 transition-colors" />
    </div>
  );

  const regions = ["germany", "europe", "india", "other"] as const;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-cream mb-1">Tour Dates</h1>
          <p className="text-cream-dim/60 font-mono text-xs">{tourDates.length} dates</p>
        </div>
        <button onClick={() => setEditing({ ...empty, sortOrder: tourDates.length })}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-mono text-xs font-bold hover:opacity-90 transition-all">
          <Plus size={14} /> Add Date
        </button>
      </div>

      {editing && (
        <div className="border border-gold/30 p-6 bg-card mb-6">
          <h2 className="font-mono text-xs text-gold/70 uppercase tracking-widest mb-4">{editing.id ? "Edit Date" : "New Date"}</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <TF label="Date (e.g. Nov 21, 2021)" value={editing.dateStr} onChange={(v) => setEditing({ ...editing, dateStr: v })} />
            <div>
              <label className="font-mono text-xs text-cream-dim/50 uppercase tracking-widest block mb-1">Region</label>
              <select value={editing.region} onChange={(e) => setEditing({ ...editing, region: e.target.value as TourDate["region"] })}
                className="w-full bg-input border border-border text-foreground text-sm p-2.5 focus:outline-none focus:border-gold/50 transition-colors">
                {regions.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            <TF label="Venue (EN)" value={editing.venueEn} onChange={(v) => setEditing({ ...editing, venueEn: v })} />
            <TF label="Venue (DE)" value={editing.venueDe} onChange={(v) => setEditing({ ...editing, venueDe: v })} />
            <TF label="City (EN)" value={editing.cityEn} onChange={(v) => setEditing({ ...editing, cityEn: v })} />
            <TF label="City (DE)" value={editing.cityDe} onChange={(v) => setEditing({ ...editing, cityDe: v })} />
            <TF label="Country (EN)" value={editing.countryEn} onChange={(v) => setEditing({ ...editing, countryEn: v })} />
            <TF label="Country (DE)" value={editing.countryDe} onChange={(v) => setEditing({ ...editing, countryDe: v })} />
            <TF label="Event URL (optional)" value={editing.eventUrl || ""} onChange={(v) => setEditing({ ...editing, eventUrl: v })} />
            <TF label="Sort Order" value={String(editing.sortOrder)} onChange={(v) => setEditing({ ...editing, sortOrder: Number(v) })} />
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
        {tourDates.map((d) => (
          <div key={d.id} className="flex items-center gap-4 p-4 border border-gold/10 hover:border-gold/25 bg-card transition-all">
            <span className="font-mono text-xs text-gold/40 w-32 shrink-0">{d.dateStr}</span>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-cream">{d.venueEn}</p>
              <p className="font-mono text-xs text-cream-dim/40">{d.cityEn}, {d.countryEn} · <span className="text-gold/40">{d.region}</span></p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(d as TourDate)}
                className="p-1.5 text-cream-dim/40 hover:text-gold transition-colors"><Pencil size={13} /></button>
              <button onClick={() => { if (confirm("Delete?")) del.mutate({ id: d.id }); }}
                className="p-1.5 text-cream-dim/40 hover:text-destructive transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

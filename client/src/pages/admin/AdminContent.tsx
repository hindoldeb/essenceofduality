import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const contentFields = [
  { key: "hero_title", label: "Hero Title", bilingual: false },
  { key: "hero_subtitle", label: "Hero Subtitle", bilingual: true },
  { key: "hero_quote", label: "Hero Quote", bilingual: true, multiline: true },
  { key: "album_description", label: "Album Description", bilingual: true, multiline: true },
  { key: "album_release", label: "Album Release Date", bilingual: false },
  { key: "album_label", label: "Album Label", bilingual: false },
  { key: "artist_quote", label: "Artist Quote (centre section)", bilingual: true, multiline: true },
  { key: "ragas_intro", label: "Ragas Section Intro", bilingual: true, multiline: true },
  { key: "artist_bio", label: "Artist Biography", bilingual: true, multiline: true },
];

const imageFields = [
  { key: "hero_bg_url", label: "Hero Background Image" },
  { key: "album_cover_url", label: "Album Cover" },
  { key: "artist_portrait_url", label: "Artist Portrait" },
];

export default function AdminContent() {
  const { data: allContent = [], refetch } = trpc.content.getAllSiteContent.useQuery();
  const upsert = trpc.admin.upsertSiteContent.useMutation({
    onSuccess: () => { refetch(); toast.success("Saved!"); },
    onError: (e) => toast.error("Error: " + e.message),
  });

  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  // Use a stable serialised key so the effect only runs when the actual data changes,
  // not every time tRPC returns a new array reference.
  const contentKey = allContent.map((c) => `${c.key}__${c.lang}__${c.value}`).join("|");
  useEffect(() => {
    const map: Record<string, string> = {};
    allContent.forEach((c) => { map[`${c.key}__${c.lang}`] = c.value; });
    setValues(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentKey]);

  const get = (key: string, lang: string) => values[`${key}__${lang}`] || "";
  const set = (key: string, lang: string, val: string) =>
    setValues((prev) => ({ ...prev, [`${key}__${lang}`]: val }));

  const save = async (key: string, lang: "en" | "de") => {
    const k = `${key}__${lang}`;
    setSaving(k);
    await upsert.mutateAsync({ key, lang, value: values[k] || "" });
    setSaving(null);
  };

  const saveImage = async (key: string, url: string) => {
    set(key, "en", url);
    await upsert.mutateAsync({ key, lang: "en", value: url });
    toast.success("Image saved!");
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-serif text-3xl text-cream mb-1">Site Content</h1>
      <p className="text-cream-dim/60 font-mono text-xs mb-8">Edit all text content in both English and German</p>

      {/* Image fields */}
      <section className="mb-10">
        <h2 className="font-serif text-xl text-gold mb-4 border-b border-gold/15 pb-2">Images</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {imageFields.map((f) => (
            <div key={f.key}>
              <label className="font-mono text-xs text-cream-dim/60 uppercase tracking-widest block mb-2">{f.label}</label>
              <ImageUpload
                currentUrl={get(f.key, "en")}
                onUploaded={(url) => saveImage(f.key, url)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Text fields */}
      <section>
        <h2 className="font-serif text-xl text-gold mb-4 border-b border-gold/15 pb-2">Text Content</h2>
        <div className="space-y-8">
          {contentFields.map((f) => (
            <div key={f.key} className="border border-gold/10 p-5 bg-card">
              <h3 className="font-mono text-xs text-gold/70 uppercase tracking-widest mb-4">{f.label}</h3>
              <div className={`grid gap-4 ${f.bilingual ? "md:grid-cols-2" : ""}`}>
                {(f.bilingual ? ["en", "de"] : ["en"]).map((lang) => (
                  <div key={lang}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-cream-dim/50 uppercase">{lang === "en" ? "English" : "German"}</span>
                      <button
                        onClick={() => save(f.key, lang as "en" | "de")}
                        disabled={saving === `${f.key}__${lang}`}
                        className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 hover:bg-gold/20 text-gold font-mono text-xs transition-all disabled:opacity-50"
                      >
                        {saving === `${f.key}__${lang}` ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />}
                        Save
                      </button>
                    </div>
                    {f.multiline ? (
                      <textarea
                        value={get(f.key, lang)}
                        onChange={(e) => set(f.key, lang, e.target.value)}
                        rows={4}
                        className="w-full bg-input border border-border text-foreground font-body text-sm p-3 resize-y focus:outline-none focus:border-gold/50 transition-colors"
                        placeholder={`${f.label} (${lang.toUpperCase()})`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={get(f.key, lang)}
                        onChange={(e) => set(f.key, lang, e.target.value)}
                        className="w-full bg-input border border-border text-foreground font-body text-sm p-3 focus:outline-none focus:border-gold/50 transition-colors"
                        placeholder={`${f.label} (${lang.toUpperCase()})`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

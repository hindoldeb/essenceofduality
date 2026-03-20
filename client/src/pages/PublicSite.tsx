import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

// Helper: get content value by key from array
function getContent(items: { key: string; lang: string; value: string }[], key: string, lang: string) {
  return items.find((i) => i.key === key && i.lang === lang)?.value || "";
}

// Star rating display
function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-gold font-mono text-sm tracking-widest">
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

// Language toggle button
function LangToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center gap-1 bg-black/40 border border-gold-30 rounded-full px-1 py-1">
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
          lang === "en" ? "bg-gold text-black" : "text-cream-dim hover:text-gold"
        }`}
      >EN</button>
      <button
        onClick={() => setLang("de")}
        className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
          lang === "de" ? "bg-gold text-black" : "text-cream-dim hover:text-gold"
        }`}
      >DE</button>
    </div>
  );
}

export default function PublicSite() {
  const { lang, t } = useLanguage();
  const { data: contentItems = [] } = trpc.content.getSiteContent.useQuery({ lang });
  const { data: allContent = [] } = trpc.content.getAllSiteContent.useQuery();
  const { data: tracks = [] } = trpc.content.getTracks.useQuery();
  const { data: musicians = [] } = trpc.content.getMusicians.useQuery();
  const { data: reviews = [] } = trpc.content.getPressReviews.useQuery();
  const { data: tourDates = [] } = trpc.content.getTourDates.useQuery();
  const { data: gallery = [] } = trpc.content.getGalleryImages.useQuery();
  const { data: streamingLinks = [] } = trpc.content.getStreamingLinks.useQuery();
  const { data: ragas = [] } = trpc.content.getRagaDescriptions.useQuery();
  const { data: sections = [] } = trpc.content.getSections.useQuery();

  const gc = (key: string) => getContent(allContent, key, lang);

  const isSectionVisible = (key: string) => {
    const s = sections.find((s) => s.key === key);
    return s ? s.isVisible : true;
  };

  const albumCover = gc("album_cover_url") || "https://files.manuscdn.com/user_upload_by_module/session_file/310519663385695563/xyncoXKeOERiTExc.jpg";
  const heroBg = gc("hero_bg_url");
  const heroTitle = gc("hero_title") || "Hindol Deb Quartet";
  const heroSubtitle = gc("hero_subtitle") || t("Where Raga Meets Jazz", "Wo Raga auf Jazz trifft");
  const heroQuote = gc("hero_quote") || t(
    "An exploration of the space between Indian classical music and jazz, where raga and improvisation meet in unexpected and beautiful ways.",
    "Eine Erkundung des Raums zwischen indischer klassischer Musik und Jazz, wo Raga und Improvisation auf unerwartete und wunderschöne Weise aufeinandertreffen."
  );
  const albumDesc = gc("album_description") || t(
    "Essence of Duality is the debut crossover jazz album by Cologne-based sitarist Hindol Deb. The album explores and crosses the boundaries of jazz and Indian classical music, making aesthetic connections between the two.",
    "Essence of Duality ist das Debüt-Crossover-Jazz-Album des in Köln lebenden Sitaristen Hindol Deb. Das Album erkundet und überschreitet die Grenzen von Jazz und indischer klassischer Musik."
  );
  const artistBio = gc("artist_bio") || t(
    "Hindol Deb is an internationally renowned Indian classical sitarist whose artistry is defined by a profound adherence to his traditional heritage and a visionary quest for musical expansion. Representing the celebrated Maihar and Rampur Gharanas, Hindol has established himself as a virtuoso who bridges the ancient spiritual depth of the Raga with the infinite possibilities of global contemporary music.",
    "Hindol Deb ist ein international renommierter indischer klassischer Sitarist, dessen Kunst durch eine tiefe Verbundenheit mit seinem traditionellen Erbe und eine visionäre Suche nach musikalischer Erweiterung geprägt ist."
  );

  const platformIcons: Record<string, string> = {
    spotify: "🎵", "apple music": "🎵", "youtube music": "▶", "buy cd": "💿", "cto music": "💿",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <span className="font-mono text-sm text-gold/70 tracking-widest uppercase">Hindol Deb Quartet</span>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-xs font-mono text-cream-dim hover:text-gold transition-colors">
            Admin ↗
          </Link>
          <LangToggle />
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={heroBg ? {
          height: '100vh',
          backgroundImage: `linear-gradient(to bottom, rgba(5,4,2,0.45) 0%, rgba(5,4,2,0.60) 50%, rgba(5,4,2,0.92) 100%), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 5%',
          backgroundRepeat: 'no-repeat',
        } : {
          height: '100vh',
          background: `radial-gradient(ellipse at 60% 40%, oklch(0.20 0.04 60) 0%, oklch(0.08 0.015 60) 50%, oklch(0.04 0.005 60) 100%)`,
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 z-10 text-center px-6 pb-2 md:pb-3" style={{transform: 'translateY(0)'}}>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-0 text-gradient-gold whitespace-nowrap">
            {heroTitle}
          </h1>
          <div className="w-12 h-px bg-gold/40 mx-auto my-1" />
          <p className="font-body italic text-4xl md:text-5xl text-cream-dim" style={{marginBottom:'0.5cm'}}>{heroSubtitle}</p>
          <p className="font-body text-cream-dim/70 text-xl max-w-2xl mx-auto mb-2 italic hidden md:block">"{heroQuote}"</p>
          <div className="flex justify-center gap-4 mb-4">
            {streamingLinks.filter(l => l.isActive && l.platform.toLowerCase().includes("spotify")).map(l => (
              <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
                className="px-4 py-1 border-2 border-gold/80 text-gold font-mono text-xs font-bold tracking-widest uppercase hover:bg-gold/10 transition-all">
                {t("Listen on Spotify", "Auf Spotify hören")}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Album ── */}
      {isSectionVisible("album") && (
        <section id="album" className="py-24 px-6 section-divider" style={{background:'oklch(0.14 0.018 60)'}}>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gold/10 rounded-sm blur-xl group-hover:bg-gold/20 transition-all" />
              <img src={albumCover} alt="Essence of Duality Album Cover"
                className="relative w-full max-w-sm mx-auto shadow-2xl shadow-gold/20" />
              <div className="absolute top-3 right-3 bg-gold text-black font-mono text-xs font-bold px-3 py-1 tracking-widest">
                {t("DEBUT ALBUM", "DEBÜTALBUM")}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs text-gold/60 tracking-widest uppercase mb-3">{t("The Album", "Das Album")}</p>
              <h2 className="font-serif text-5xl font-bold text-cream mb-4">Essence of Duality</h2>
              <div className="w-10 h-px bg-gold mb-6" />
              <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div>
                  <p className="font-mono text-xs text-gold/50 uppercase tracking-widest mb-1">{t("Released", "Veröffentlicht")}</p>
                  <p className="text-cream">{gc("album_release") || "October 1, 2021"}</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-gold/50 uppercase tracking-widest mb-1">{t("Genre", "Genre")}</p>
                  <p className="text-cream">{t("Crossover Jazz / World Music", "Crossover Jazz / Weltmusik")}</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-gold/50 uppercase tracking-widest mb-1">{t("Label", "Label")}</p>
                  <p className="text-cream">{gc("album_label") || "Medieval Raga Records"}</p>
                </div>
              </div>
              <p className="text-cream-dim leading-relaxed mb-8 text-lg">{albumDesc}</p>
              <div className="flex flex-wrap gap-3">
                {streamingLinks.filter(l => l.isActive).map(l => (
                  <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gold-30 text-gold/80 hover:border-gold hover:text-gold font-mono text-xs tracking-wider transition-all">
                    <span>{platformIcons[l.platform.toLowerCase()] || "🎵"}</span>
                    {l.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Tracklist ── */}
      {isSectionVisible("tracklist") && tracks.length > 0 && (
        <section id="tracklist" className="py-24 px-6 section-divider" style={{background:'oklch(0.06 0.005 60)'}}>
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs text-gold/60 tracking-widest uppercase mb-3 text-center">{t("Full Tracklist", "Vollständige Titelliste")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream text-center mb-2">
              {t("Nine Journeys Between Two Worlds", "Neun Reisen zwischen zwei Welten")}
            </h2>
            <div className="w-12 h-px bg-gold/40 mx-auto mb-12" />
            <div className="space-y-0">
              {tracks.map((track, i) => (
                <div key={track.id}
                  className="flex items-center gap-6 py-5 border-b border-gold/10 hover:bg-gold/5 transition-all px-4 group">
                  <span className="font-mono text-xs text-gold/30 w-6 shrink-0 group-hover:text-gold/60 transition-colors">
                    {String(track.trackNumber).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg text-cream group-hover:text-gold transition-colors">
                      {lang === "de" ? track.titleDe : track.titleEn}
                    </p>
                    <p className="font-mono text-xs text-gold/50 mt-0.5">
                      {lang === "de" ? track.ragaDe : track.ragaEn}
                      {(lang === "de" ? track.subtitleDe : track.subtitleEn) && (
                        <span className="text-cream-dim/40 ml-2">· {lang === "de" ? track.subtitleDe : track.subtitleEn}</span>
                      )}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-gold/60 shrink-0">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Artist Quote ── */}
      <section className="py-20 px-6 section-divider" style={{background:'oklch(0.14 0.018 60)'}}>
        <div className="max-w-2xl mx-auto text-center">
          {/* Quote image */}
          {gc("quote_image_url") ? (
            <div className="mb-10 flex justify-center">
              <img
                src={gc("quote_image_url")}
                alt="Hindol Deb"
                className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-sm border border-gold-15 hover:border-gold transition-all duration-500"
              />
            </div>
          ) : (
            <div className="mb-10 flex justify-center">
              <div className="w-48 h-48 md:w-64 md:h-64 border border-dashed border-gold-30 flex flex-col items-center justify-center text-gold/30 rounded-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="font-mono text-xs tracking-widest uppercase opacity-50">Add Photo</span>
              </div>
            </div>
          )}
          <div className="text-gold/30 text-xs font-mono tracking-[0.5em] mb-8">✦ ✦ ✦</div>
          <blockquote className="font-body italic text-xl md:text-2xl text-cream-dim leading-relaxed mb-6">
            "{gc("artist_quote") || t(
              "It started with the duality of two styles of music. On the one hand, my classical Indian background, which I brought with me to Germany, and on the other, music built on harmonies.",
              "Es begann mit der Dualität zweier Musikstile. Einerseits mein klassisch-indischer Hintergrund, den ich mit nach Deutschland brachte, und andererseits auf Harmonien aufgebaute Musik."
            )}"
          </blockquote>
          <p className="font-mono text-xs text-gold/50 tracking-widest">— Hindol Deb, Qantara.de, 2021</p>
          <div className="text-gold/30 text-xs font-mono tracking-[0.5em] mt-8">✦ ✦ ✦</div>
        </div>
      </section>

      {/* ── Musicians ── */}
      {isSectionVisible("musicians") && musicians.length > 0 && (
        <section id="musicians" className="py-24 px-6 section-divider" style={{background:'oklch(0.06 0.005 60)'}}>
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-xs text-gold/60 tracking-widest uppercase mb-3 text-center">{t("The Quartet", "Das Quartett")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream text-center mb-2">
              {t("Four Voices, One Conversation", "Vier Stimmen, ein Gespräch")}
            </h2>
            <div className="w-12 h-px bg-gold/40 mx-auto mb-16" />
            <div className="grid md:grid-cols-2 gap-8">
              {musicians.map((m) => (
                <div key={m.id} className="flex gap-6 p-6 border border-gold-15 hover:border-gold transition-all bg-black/20">
                  {m.imageUrl && (
                    <img src={m.imageUrl} alt={lang === "de" ? m.nameDe : m.nameEn}
                      className="w-20 h-20 object-cover shrink-0 grayscale hover:grayscale-0 transition-all" />
                  )}
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-gold/50 uppercase tracking-widest mb-1">
                      {lang === "de" ? m.roleDe : m.roleEn}
                    </p>
                    <h3 className="font-serif text-xl text-cream mb-3">{lang === "de" ? m.nameDe : m.nameEn}</h3>
                    <p className="text-cream-dim text-sm leading-relaxed">{lang === "de" ? m.bioDe : m.bioEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery ── */}
      {isSectionVisible("gallery") && gallery.length > 0 && (
        <section id="gallery" className="py-24 px-6 section-divider" style={{background:'oklch(0.14 0.018 60)'}}>
          <div className="max-w-6xl mx-auto">
            <p className="font-mono text-xs text-gold/60 tracking-widest uppercase mb-3 text-center">{t("Gallery", "Galerie")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream text-center mb-2">
              {t("On Stage & In the Studio", "Auf der Bühne & im Studio")}
            </h2>
            <div className="w-12 h-px bg-gold/40 mx-auto mb-12" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.map((img) => (
                <div key={img.id} className="relative group overflow-hidden aspect-[4/3]">
                  <img src={img.imageUrl} alt={lang === "de" ? img.altDe || "" : img.altEn || ""}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                  {(lang === "de" ? img.captionDe : img.captionEn) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="font-mono text-xs text-gold/80">{lang === "de" ? img.captionDe : img.captionEn}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Press Reviews ── */}
      {isSectionVisible("reviews") && reviews.length > 0 && (
        <section id="reviews" className="py-24 px-6 section-divider" style={{background:'oklch(0.06 0.005 60)'}}>
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-xs text-gold/60 tracking-widest uppercase mb-3 text-center">{t("Critical Reception", "Kritische Rezeption")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream text-center mb-2">
              {t("What the World is Saying", "Was die Welt sagt")}
            </h2>
            <div className="w-12 h-px bg-gold/40 mx-auto mb-12" />
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="p-8 border border-gold-15 hover:border-gold transition-all bg-black/20">
                  <blockquote className="font-body italic text-cream-dim leading-relaxed text-lg mb-6">
                    "{lang === "de" ? r.quoteDe : r.quoteEn}"
                  </blockquote>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-serif text-gold font-semibold">{lang === "de" ? r.publicationDe : r.publicationEn}</p>
                      {(lang === "de" ? r.reviewerDe : r.reviewerEn) && (
                        <p className="font-mono text-xs text-cream-dim/60 mt-0.5">{lang === "de" ? r.reviewerDe : r.reviewerEn}</p>
                      )}
                      {(lang === "de" ? r.dateDe : r.dateEn) && (
                        <p className="font-mono text-xs text-cream-dim/40 mt-0.5">{lang === "de" ? r.dateDe : r.dateEn}</p>
                      )}
                    </div>
                    {r.rating && r.rating > 0 ? <Stars rating={r.rating} /> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Ragas ── */}
      {isSectionVisible("ragas") && ragas.length > 0 && (
        <section id="ragas" className="py-24 px-6 section-divider" style={{background:'oklch(0.14 0.018 60)'}}>
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-xs text-gold/60 tracking-widest uppercase mb-3 text-center">{t("The Ragas", "Die Ragas")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream text-center mb-2">
              {t("Ancient Scales, New Conversations", "Alte Skalen, neue Gespräche")}
            </h2>
            <div className="w-12 h-px bg-gold/40 mx-auto mb-6" />
            <p className="text-cream-dim text-center max-w-2xl mx-auto mb-12 text-lg">
              {gc("ragas_intro") || t(
                "Each composition on the album is rooted in a specific raga — the melodic framework of Indian classical music.",
                "Jede Komposition auf dem Album ist in einem bestimmten Raga verwurzelt — dem melodischen Rahmen der indischen klassischen Musik."
              )}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ragas.map((r) => (
                <div key={r.id} className="p-5 border border-gold-15 hover:border-gold transition-all bg-black/20 group">
                  <p className="font-mono text-xs text-gold/50 uppercase tracking-widest mb-2 group-hover:text-gold/80 transition-colors">{r.ragaName}</p>
                  <p className="font-serif text-lg text-cream mb-3">{lang === "de" ? r.trackTitleDe : r.trackTitleEn}</p>
                  <p className="text-cream-dim text-sm leading-relaxed">{lang === "de" ? r.descriptionDe : r.descriptionEn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Artist Bio ── */}
      {isSectionVisible("bio") && (
        <section id="bio" className="py-24 px-6 section-divider" style={{background:'oklch(0.06 0.005 60)'}}>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12 items-start">
            <div className="md:col-span-1">
              <img
                src={gc("artist_portrait_url") || "https://files.manuscdn.com/user_upload_by_module/session_file/310519663385695563/aIncuEcaLDGVmvny.jpg"}
                alt="Hindol Deb"
                className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="md:col-span-2">
              <p className="font-mono text-xs text-gold/60 tracking-widest uppercase mb-3">{t("The Artist", "Der Künstler")}</p>
              <h2 className="font-serif text-4xl font-bold text-cream mb-4">Hindol Deb</h2>
              <div className="w-10 h-px bg-gold mb-6" />
              <div className="text-cream-dim leading-relaxed space-y-4 text-lg">
                {artistBio.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
              </div>
              <a href="https://hindoldeb.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 font-mono text-xs text-gold/70 hover:text-gold border-b border-gold/30 hover:border-gold transition-all pb-0.5">
                hindoldeb.com ↗
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── Tour Dates ── */}
      {isSectionVisible("tour") && tourDates.length > 0 && (
        <section id="tour" className="py-24 px-6 section-divider" style={{background:'oklch(0.14 0.018 60)'}}>
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs text-gold/60 tracking-widest uppercase mb-3 text-center">{t("Tour History", "Tourneegeschichte")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream text-center mb-2">
              {t("Concerts & Performances", "Konzerte & Auftritte")}
            </h2>
            <div className="w-12 h-px bg-gold/40 mx-auto mb-12" />
            {["germany", "india", "europe", "other"].map((region) => {
              const regionDates = tourDates.filter((d) => d.region === region);
              if (!regionDates.length) return null;
              const regionLabel: Record<string, { en: string; de: string }> = {
                germany: { en: "Germany", de: "Deutschland" },
                india: { en: "India Tour", de: "Indien-Tournee" },
                europe: { en: "Europe", de: "Europa" },
                other: { en: "International", de: "International" },
              };
              return (
                <div key={region} className="mb-10">
                  <h3 className="font-mono text-xs text-gold/50 uppercase tracking-widest mb-4 border-b border-gold/10 pb-2">
                    {lang === "de" ? regionLabel[region].de : regionLabel[region].en}
                  </h3>
                  <div className="space-y-3">
                    {regionDates.map((d) => (
                      <div key={d.id} className="flex items-start gap-6 py-3 border border-gold-15 hover:border-gold transition-all px-3 mb-2 bg-black/10">
                        <span className="font-mono text-xs text-gold/50 shrink-0 w-28 pt-0.5">{d.dateStr}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-cream">{lang === "de" ? d.venueDe : d.venueEn}</p>
                          <p className="font-mono text-xs text-cream-dim/50 mt-0.5">
                            {lang === "de" ? d.cityDe : d.cityEn}, {lang === "de" ? d.countryDe : d.countryEn}
                          </p>
                        </div>
                        {d.eventUrl && (
                          <a href={d.eventUrl} target="_blank" rel="noopener noreferrer"
                            className="font-mono text-xs text-gold/40 hover:text-gold shrink-0 transition-colors">↗</a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="pt-16 pb-0 px-6 border-t border-gold/30 bg-black">
        <div className="max-w-5xl mx-auto">
          {/* Three-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16">
            {/* Left: Hindol Deb info */}
            <div>
              <h2 className="font-serif text-2xl text-cream mb-4">Hindol Deb</h2>
              <p className="font-body italic text-cream-dim/60 text-sm leading-relaxed">
                Sitarist · Composer · Educator<br />
                Bridging Indian Classical Raga with Jazz &amp; World Music<br />
                Cologne, Germany
              </p>
            </div>
            {/* Center: LISTEN */}
            <div>
              <p className="font-mono text-xs text-gold/60 tracking-widest uppercase mb-5">Listen</p>
              <div className="space-y-3">
                {streamingLinks.filter(l => l.isActive).map(l => (
                  <div key={l.id}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer"
                      className="font-body text-cream-dim/70 hover:text-gold transition-colors text-sm">
                      {l.platform}
                    </a>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: DISCOVER */}
            <div>
              <p className="font-mono text-xs text-gold/60 tracking-widest uppercase mb-5">Discover</p>
              <div className="space-y-3">
                <div><a href="https://hindoldeb.com" target="_blank" rel="noopener noreferrer" className="font-body text-cream-dim/70 hover:text-gold transition-colors text-sm">hindoldeb.com</a></div>
                <div><a href="https://qantara.de/en/article/hindol-deb-where-raga-meets-jazz" target="_blank" rel="noopener noreferrer" className="font-body text-cream-dim/70 hover:text-gold transition-colors text-sm">Qantara.de Review</a></div>
                <div><a href="https://songlines.co.uk" target="_blank" rel="noopener noreferrer" className="font-body text-cream-dim/70 hover:text-gold transition-colors text-sm">Songlines Review</a></div>
                <div><a href="https://www.allaboutjazz.com" target="_blank" rel="noopener noreferrer" className="font-body text-cream-dim/70 hover:text-gold transition-colors text-sm">All About Jazz</a></div>
              </div>
            </div>
          </div>
          {/* Copyright bar */}
          <div className="border-t border-gold/15 py-5 text-center">
            <p className="font-mono text-xs text-cream-dim/30">© 2021 Hindol Deb · Medieval Raga Records · All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

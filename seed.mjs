import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import { siteContent, tracks, musicians, pressReviews, tourDates, streamingLinks, ragaDescriptions } from "./drizzle/schema.js";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("🌱 Seeding database...");

// ─── Site Content ────────────────────────────────────────────────────────────
const contentData = [
  { key: "hero_title", lang: "en", value: "Essence of Duality" },
  { key: "hero_title", lang: "de", value: "Essence of Duality" },
  { key: "hero_subtitle", lang: "en", value: "Where Raga Meets Jazz" },
  { key: "hero_subtitle", lang: "de", value: "Wo Raga auf Jazz trifft" },
  { key: "hero_quote", lang: "en", value: "An exploration of the space between Indian classical music and jazz, where raga and improvisation meet in unexpected and beautiful ways." },
  { key: "hero_quote", lang: "de", value: "Eine Erkundung des Raums zwischen indischer klassischer Musik und Jazz, wo Raga und Improvisation auf unerwartete und wunderschöne Weise aufeinandertreffen." },
  { key: "album_description", lang: "en", value: "Essence of Duality is the debut crossover jazz album by Cologne-based sitarist Hindol Deb, released on October 1, 2021 via Medieval Raga Records. The album explores and crosses the boundaries of jazz and Indian classical music, making aesthetic connections between the two. Recorded in Cologne with four exceptional European jazz musicians, the album features nine original compositions rooted in specific ragas reimagined through jazz harmonies and improvisation." },
  { key: "album_description", lang: "de", value: "Essence of Duality ist das Debüt-Crossover-Jazz-Album des in Köln lebenden Sitaristen Hindol Deb, das am 1. Oktober 2021 über Medieval Raga Records veröffentlicht wurde. Das Album erkundet und überschreitet die Grenzen von Jazz und indischer klassischer Musik. In Köln mit vier außergewöhnlichen europäischen Jazzmusikern aufgenommen, enthält das Album neun Originalkompositionen, die in spezifischen Ragas verwurzelt und durch Jazzharmonien neu interpretiert sind." },
  { key: "album_release", lang: "en", value: "October 1, 2021" },
  { key: "album_release", lang: "de", value: "1. Oktober 2021" },
  { key: "album_label", lang: "en", value: "Medieval Raga Records" },
  { key: "album_label", lang: "de", value: "Medieval Raga Records" },
  { key: "artist_quote", lang: "en", value: "It started with the duality of two styles of music. On the one hand, my classical Indian background, which I brought with me to Germany, and on the other, music built on harmonies. I wanted to find a way to bring these two worlds together — not as a compromise, but as a genuine conversation." },
  { key: "artist_quote", lang: "de", value: "Es begann mit der Dualität zweier Musikstile. Einerseits mein klassisch-indischer Hintergrund, den ich mit nach Deutschland brachte, und andererseits auf Harmonien aufgebaute Musik. Ich wollte einen Weg finden, diese beiden Welten zusammenzubringen — nicht als Kompromiss, sondern als echtes Gespräch." },
  { key: "ragas_intro", lang: "en", value: "Each composition on the album is rooted in a specific raga — the melodic framework of Indian classical music that defines not just the notes, but the mood, time of day, and emotional essence of the music." },
  { key: "ragas_intro", lang: "de", value: "Jede Komposition auf dem Album ist in einem bestimmten Raga verwurzelt — dem melodischen Rahmen der indischen klassischen Musik, der nicht nur die Noten, sondern auch die Stimmung, die Tageszeit und das emotionale Wesen der Musik definiert." },
  { key: "artist_bio", lang: "en", value: "Hindol Deb is an internationally renowned Indian classical sitarist whose artistry is defined by a profound adherence to his traditional heritage and a visionary quest for musical expansion. Representing the celebrated Maihar and Rampur Gharanas, Hindol has established himself as a virtuoso who bridges the ancient spiritual depth of the Raga with the infinite possibilities of global contemporary music.\n\nBorn in Kolkata and trained under the legendary Pandit Bimalendu Mukherjee, Hindol moved to Cologne, Germany, where he has been based for over two decades. He is the recipient of the DAAD scholarship and has been recognised by the German government for his contributions to cultural exchange.\n\nHe has collaborated with musicians from across the globe — jazz, flamenco, and electronic — always maintaining the integrity of the raga at the core of his work. As founder of the Medieval Raga Academy in Cologne, he is deeply committed to passing on the tradition to students worldwide." },
  { key: "artist_bio", lang: "de", value: "Hindol Deb ist ein international renommierter indischer klassischer Sitarist, dessen Kunst durch eine tiefe Verbundenheit mit seinem traditionellen Erbe und eine visionäre Suche nach musikalischer Erweiterung geprägt ist. Als Vertreter der gefeierten Maihar- und Rampur-Gharanas hat sich Hindol als Virtuose etabliert, der die alte spirituelle Tiefe des Raga mit den unendlichen Möglichkeiten der globalen zeitgenössischen Musik verbindet.\n\nIn Kalkutta geboren und unter dem legendären Pandit Bimalendu Mukherjee ausgebildet, zog Hindol nach Köln, wo er seit über zwei Jahrzehnten lebt. Er ist DAAD-Stipendiat und wurde von der deutschen Regierung für seinen Beitrag zum Kulturaustausch ausgezeichnet.\n\nAls Gründer der Medieval Raga Academy in Köln ist er tief dem Weitergeben der Tradition verpflichtet." },
  { key: "album_cover_url", lang: "en", value: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663385695563/xyncoXKeOERiTExc.jpg" },
  { key: "hero_bg_url", lang: "en", value: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663385695563/PTUsIMhSwCnbPxzQ.jpeg" },
  { key: "artist_portrait_url", lang: "en", value: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663385695563/aIncuEcaLDGVmvny.jpg" },
];

for (const item of contentData) {
  await db.insert(siteContent).values(item).onDuplicateKeyUpdate({ set: { value: item.value } });
}
console.log("✅ Site content seeded");

// ─── Tracks ──────────────────────────────────────────────────────────────────
const tracksData = [
  { trackNumber: 1, titleEn: "Duality", titleDe: "Dualität", ragaEn: "Raga Bhairav", ragaDe: "Raga Bhairav", subtitleEn: "Morning Raga", subtitleDe: "Morgen-Raga", duration: "7:42", sortOrder: 1 },
  { trackNumber: 2, titleEn: "Longing", titleDe: "Sehnsucht", ragaEn: "Raga Yaman", ragaDe: "Raga Yaman", subtitleEn: "Evening Raga", subtitleDe: "Abend-Raga", duration: "8:15", sortOrder: 2 },
  { trackNumber: 3, titleEn: "Conversation", titleDe: "Gespräch", ragaEn: "Raga Kafi", ragaDe: "Raga Kafi", subtitleEn: "Monsoon Raga", subtitleDe: "Monsun-Raga", duration: "6:53", sortOrder: 3 },
  { trackNumber: 4, titleEn: "Awakening", titleDe: "Erwachen", ragaEn: "Raga Bairagi", ragaDe: "Raga Bairagi", subtitleEn: "Dawn Raga", subtitleDe: "Dämmerungs-Raga", duration: "9:04", sortOrder: 4 },
  { trackNumber: 5, titleEn: "The Bridge", titleDe: "Die Brücke", ragaEn: "Raga Bhimpalasi", ragaDe: "Raga Bhimpalasi", subtitleEn: "Afternoon Raga", subtitleDe: "Nachmittags-Raga", duration: "7:28", sortOrder: 5 },
  { trackNumber: 6, titleEn: "Reflection", titleDe: "Reflexion", ragaEn: "Raga Chandrakauns", ragaDe: "Raga Chandrakauns", subtitleEn: "Night Raga", subtitleDe: "Nacht-Raga", duration: "8:36", sortOrder: 6 },
  { trackNumber: 7, titleEn: "Wanderer", titleDe: "Wanderer", ragaEn: "Raga Bhupali", ragaDe: "Raga Bhupali", subtitleEn: "Pentatonic Raga", subtitleDe: "Pentatonischer Raga", duration: "6:19", sortOrder: 7 },
  { trackNumber: 8, titleEn: "Surrender", titleDe: "Hingabe", ragaEn: "Raga Darbari Kanada", ragaDe: "Raga Darbari Kanada", subtitleEn: "Late Night Raga", subtitleDe: "Spätnacht-Raga", duration: "10:12", sortOrder: 8 },
  { trackNumber: 9, titleEn: "Essence", titleDe: "Essenz", ragaEn: "Raga Bhairavi", ragaDe: "Raga Bhairavi", subtitleEn: "Farewell Raga", subtitleDe: "Abschied-Raga", duration: "9:47", sortOrder: 9 },
];

for (const t of tracksData) {
  await db.insert(tracks).values(t).onDuplicateKeyUpdate({ set: { titleEn: t.titleEn, duration: t.duration } });
}
console.log("✅ Tracks seeded");

// ─── Musicians ───────────────────────────────────────────────────────────────
const musiciansData = [
  { nameEn: "Hindol Deb", nameDe: "Hindol Deb", roleEn: "Sitar", roleDe: "Sitar", bioEn: "Cologne-based Indian classical sitarist representing the Maihar and Rampur Gharanas. Trained under Pandit Bimalendu Mukherjee, Hindol has performed across India, Europe and the world. DAAD scholarship recipient and founder of the Medieval Raga Academy in Cologne.", bioDe: "In Köln lebender indischer klassischer Sitarist, der die Maihar- und Rampur-Gharanas repräsentiert. Unter Pandit Bimalendu Mukherjee ausgebildet, hat Hindol in Indien, Europa und der Welt aufgetreten. DAAD-Stipendiat und Gründer der Medieval Raga Academy in Köln.", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663385695563/aIncuEcaLDGVmvny.jpg", sortOrder: 1 },
  { nameEn: "Clemens Orth", nameDe: "Clemens Orth", roleEn: "Piano", roleDe: "Klavier", bioEn: "Cologne-based jazz pianist known for his sensitive harmonic language and ability to bridge musical worlds. A sought-after collaborator in the European jazz scene, Clemens brings a lyrical touch to the album's harmonic architecture.", bioDe: "In Köln ansässiger Jazzpianist, bekannt für seine sensible Harmoniesprache und die Fähigkeit, musikalische Welten zu verbinden. Als gefragter Kollaborateur in der europäischen Jazzszene bringt Clemens eine lyrische Note in die harmonische Architektur des Albums.", sortOrder: 2 },
  { nameEn: "Christian Ramond", nameDe: "Christian Ramond", roleEn: "Double Bass", roleDe: "Kontrabass", bioEn: "A versatile bassist rooted in the European jazz tradition, Christian provides the harmonic and rhythmic foundation that allows the sitar and piano to soar. His deep understanding of both jazz and world music makes him an ideal partner for this cross-cultural dialogue.", bioDe: "Ein vielseitiger Bassist, der in der europäischen Jazztradition verwurzelt ist, bietet Christian das harmonische und rhythmische Fundament, das Sitar und Klavier zum Aufsteigen bringt. Sein tiefes Verständnis von Jazz und Weltmusik macht ihn zum idealen Partner für diesen interkulturellen Dialog.", sortOrder: 3 },
  { nameEn: "Jens Düppe", nameDe: "Jens Düppe", roleEn: "Drums & Percussion", roleDe: "Schlagzeug & Perkussion", bioEn: "An innovative drummer and percussionist who navigates between jazz time-keeping and the intricate rhythmic cycles of Indian classical music (tala). Jens brings a unique sensitivity to the rhythmic conversation at the heart of the album.", bioDe: "Ein innovativer Schlagzeuger und Perkussionist, der zwischen Jazz-Zeitgefühl und den komplexen Rhythmuszyklen der indischen klassischen Musik (Tala) navigiert. Jens bringt eine einzigartige Sensibilität in das rhythmische Gespräch im Herzen des Albums.", sortOrder: 4 },
];

for (const m of musiciansData) {
  await db.insert(musicians).values(m).onDuplicateKeyUpdate({ set: { bioEn: m.bioEn } });
}
console.log("✅ Musicians seeded");

// ─── Press Reviews ────────────────────────────────────────────────────────────
const reviewsData = [
  {
    publicationEn: "Qantara.de", publicationDe: "Qantara.de",
    reviewerEn: "Arno Lücker", reviewerDe: "Arno Lücker",
    quoteEn: "Beyond Exotic — A New East-West Dialogue. Hindol Deb's Essence of Duality is not just another world music crossover. It is a genuine, deeply considered conversation between two musical traditions that have more in common than their surface differences suggest. The album succeeds where so many others fail: it finds the space between the two worlds without colonising either.",
    quoteDe: "Jenseits des Exotischen — Ein neuer Ost-West-Dialog. Hindol Debs Essence of Duality ist nicht nur ein weiterer Weltmusik-Crossover. Es ist ein echtes, tiefgründig durchdachtes Gespräch zwischen zwei Musiktraditionen, die mehr gemeinsam haben, als ihre oberflächlichen Unterschiede vermuten lassen.",
    dateEn: "2021", dateDe: "2021", rating: 4, sourceUrl: "https://qantara.de/en/article/album-review-hindol-debs-essence-duality-beyond-exotic", sortOrder: 1
  },
  {
    publicationEn: "Songlines Magazine", publicationDe: "Songlines Magazine",
    reviewerEn: "Songlines", reviewerDe: "Songlines",
    quoteEn: "Hindol Deb's sitar playing is exquisite — fluid, expressive, and deeply rooted in the raga tradition. The quartet navigates the space between Indian classical music and jazz with remarkable ease, creating music that feels both ancient and completely contemporary.",
    quoteDe: "Hindol Debs Sitarspiel ist exquisit — fließend, ausdrucksstark und tief in der Raga-Tradition verwurzelt. Das Quartett navigiert den Raum zwischen indischer klassischer Musik und Jazz mit bemerkenswerter Leichtigkeit.",
    dateEn: "2021", dateDe: "2021", rating: 3, sourceUrl: "https://www.songlines.co.uk/review/essence-of-duality", sortOrder: 2
  },
  {
    publicationEn: "DUMONT Aachen", publicationDe: "DUMONT Aachen",
    reviewerEn: "DUMONT", reviewerDe: "DUMONT",
    quoteEn: "A mesmerising evening of music that transcended cultural boundaries. Hindol Deb and his quartet demonstrated that the dialogue between East and West in music is not a novelty but a necessity — a natural evolution of two great traditions finding each other.",
    quoteDe: "Ein fesselnder Musikabend, der kulturelle Grenzen überwand. Hindol Deb und sein Quartett demonstrierten, dass der Dialog zwischen Ost und West in der Musik keine Neuheit, sondern eine Notwendigkeit ist.",
    dateEn: "November 2021", dateDe: "November 2021", rating: 5, sourceUrl: "https://dumont-aachen.de/2021/11/21/hindol-deb-essence-of-duality/", sortOrder: 3
  },
  {
    publicationEn: "Poona Music Society", publicationDe: "Poona Music Society",
    reviewerEn: "Poona Music Society", reviewerDe: "Poona Music Society",
    quoteEn: "An extraordinary concert that brought together the best of two worlds. Hindol Deb's mastery of the sitar, combined with the sensitivity of his European collaborators, created an experience that was both intellectually stimulating and emotionally moving.",
    quoteDe: "Ein außergewöhnliches Konzert, das das Beste zweier Welten zusammenbrachte. Hindol Debs Meisterschaft auf der Sitar, kombiniert mit der Sensibilität seiner europäischen Mitarbeiter, schuf ein Erlebnis, das sowohl intellektuell stimulierend als auch emotional bewegend war.",
    dateEn: "2023", dateDe: "2023", rating: 5, sortOrder: 4
  },
];

for (const r of reviewsData) {
  await db.insert(pressReviews).values(r).onDuplicateKeyUpdate({ set: { quoteEn: r.quoteEn } });
}
console.log("✅ Press reviews seeded");

// ─── Tour Dates ───────────────────────────────────────────────────────────────
const tourDatesData = [
  { dateStr: "Nov 21, 2021", venueEn: "DUMONT Aachen", venueDe: "DUMONT Aachen", cityEn: "Aachen", cityDe: "Aachen", countryEn: "Germany", countryDe: "Deutschland", region: "germany", eventUrl: "https://dumont-aachen.de/2021/11/21/hindol-deb-essence-of-duality/", sortOrder: 10 },
  { dateStr: "2021", venueEn: "Stadtgarten Köln", venueDe: "Stadtgarten Köln", cityEn: "Cologne", cityDe: "Köln", countryEn: "Germany", countryDe: "Deutschland", region: "germany", sortOrder: 9 },
  { dateStr: "2022", venueEn: "Jazzhaus Freiburg", venueDe: "Jazzhaus Freiburg", cityEn: "Freiburg", cityDe: "Freiburg", countryEn: "Germany", countryDe: "Deutschland", region: "germany", sortOrder: 8 },
  { dateStr: "Oct 2023", venueEn: "Goethe-Institut Mumbai", venueDe: "Goethe-Institut Mumbai", cityEn: "Mumbai", cityDe: "Mumbai", countryEn: "India", countryDe: "Indien", region: "india", sortOrder: 7 },
  { dateStr: "Oct 2023", venueEn: "Goethe-Institut Pune", venueDe: "Goethe-Institut Pune", cityEn: "Pune", cityDe: "Pune", countryEn: "India", countryDe: "Indien", region: "india", sortOrder: 6 },
  { dateStr: "Oct 2023", venueEn: "Poona Music Society", venueDe: "Poona Music Society", cityEn: "Pune", cityDe: "Pune", countryEn: "India", countryDe: "Indien", region: "india", eventUrl: "https://poonamusic.com/events/essence-of-duality/", sortOrder: 5 },
  { dateStr: "Oct 2023", venueEn: "Bangalore International Centre", venueDe: "Bangalore International Centre", cityEn: "Bangalore", cityDe: "Bangalore", countryEn: "India", countryDe: "Indien", region: "india", eventUrl: "https://bangaloreinternationalcentre.org/event/essence-of-duality/", sortOrder: 4 },
  { dateStr: "Oct 2023", venueEn: "Goethe-Institut Kolkata", venueDe: "Goethe-Institut Kalkutta", cityEn: "Kolkata", cityDe: "Kalkutta", countryEn: "India", countryDe: "Indien", region: "india", sortOrder: 3 },
  { dateStr: "Oct 2023", venueEn: "Goethe-Institut Chennai", venueDe: "Goethe-Institut Chennai", cityEn: "Chennai", cityDe: "Chennai", countryEn: "India", countryDe: "Indien", region: "india", sortOrder: 2 },
  { dateStr: "Oct 2023", venueEn: "Goethe-Institut New Delhi", venueDe: "Goethe-Institut Neu-Delhi", cityEn: "New Delhi", cityDe: "Neu-Delhi", countryEn: "India", countryDe: "Indien", region: "india", sortOrder: 1 },
];

for (const d of tourDatesData) {
  await db.insert(tourDates).values(d).onDuplicateKeyUpdate({ set: { venueEn: d.venueEn } });
}
console.log("✅ Tour dates seeded");

// ─── Streaming Links ──────────────────────────────────────────────────────────
const streamingData = [
  { platform: "Spotify", url: "https://open.spotify.com/album/7CVJGE0u2Mkc3mbazlUVTK", sortOrder: 1, isActive: true },
  { platform: "Apple Music", url: "https://music.apple.com/us/album/essence-of-duality/1581597457", sortOrder: 2, isActive: true },
  { platform: "YouTube Music", url: "https://music.youtube.com/playlist?list=OLAK5uy_lHindolDebEssenceOfDuality", sortOrder: 3, isActive: true },
  { platform: "Buy CD", url: "http://ctomusic-shop.de/Hindol-Deb-Dilemma-Of-Duality", sortOrder: 4, isActive: true },
];

for (const s of streamingData) {
  await db.insert(streamingLinks).values(s).onDuplicateKeyUpdate({ set: { url: s.url } });
}
console.log("✅ Streaming links seeded");

// ─── Raga Descriptions ────────────────────────────────────────────────────────
const ragasData = [
  { ragaName: "Raga Bhairav", trackTitleEn: "Duality", trackTitleDe: "Dualität", descriptionEn: "A morning raga of deep contemplation and devotion. Bhairav evokes the stillness of dawn and the awakening of consciousness, with its characteristic komal (flat) second and sixth degrees.", descriptionDe: "Ein Morgen-Raga tiefer Kontemplation und Hingabe. Bhairav beschwört die Stille des Morgengrauens und das Erwachen des Bewusstseins.", sortOrder: 1 },
  { ragaName: "Raga Yaman", trackTitleEn: "Longing", trackTitleDe: "Sehnsucht", descriptionEn: "An evening raga of beauty and longing. Yaman is one of the most beloved ragas in Hindustani music, characterised by its raised fourth (tivra Ma) and a mood of romantic yearning.", descriptionDe: "Ein Abend-Raga der Schönheit und Sehnsucht. Yaman ist einer der beliebtesten Ragas in der Hindustani-Musik, gekennzeichnet durch seine erhöhte Quarte und eine Stimmung romantischer Sehnsucht.", sortOrder: 2 },
  { ragaName: "Raga Kafi", trackTitleEn: "Conversation", trackTitleDe: "Gespräch", descriptionEn: "A versatile raga associated with the monsoon season and the spirit of folk music. Kafi's pentatonic structure and use of both natural and flat thirds gives it a playful, conversational quality.", descriptionDe: "Ein vielseitiger Raga, der mit der Monsunzeit und dem Geist der Volksmusik verbunden ist. Kafis pentatonische Struktur verleiht ihm eine spielerische, gesprächige Qualität.", sortOrder: 3 },
  { ragaName: "Raga Bairagi", trackTitleEn: "Awakening", trackTitleDe: "Erwachen", descriptionEn: "A raga of renunciation and spiritual awakening. Bairagi conveys a sense of detachment from the material world and a turning towards the divine, typically performed at dawn.", descriptionDe: "Ein Raga der Entsagung und des spirituellen Erwachens. Bairagi vermittelt ein Gefühl der Losgelöstheit von der materiellen Welt, typischerweise in der Morgendämmerung gespielt.", sortOrder: 4 },
  { ragaName: "Raga Bhimpalasi", trackTitleEn: "The Bridge", trackTitleDe: "Die Brücke", descriptionEn: "An afternoon raga of deep emotion and introspection. Bhimpalasi is known for its ability to evoke feelings of longing and tenderness, with its characteristic flat third and sixth.", descriptionDe: "Ein Nachmittags-Raga tiefer Emotion und Introspektion. Bhimpalasi ist bekannt für seine Fähigkeit, Gefühle der Sehnsucht und Zärtlichkeit hervorzurufen.", sortOrder: 5 },
  { ragaName: "Raga Chandrakauns", trackTitleEn: "Reflection", trackTitleDe: "Reflexion", descriptionEn: "A night raga of mystery and depth. Chandrakauns is a pentatonic raga that creates an atmosphere of moonlit contemplation, with its haunting combination of flat third, flat sixth, and natural seventh.", descriptionDe: "Ein Nacht-Raga der Mystik und Tiefe. Chandrakauns ist ein pentatonischer Raga, der eine Atmosphäre mondlichtbeschienener Kontemplation schafft.", sortOrder: 6 },
  { ragaName: "Raga Bhupali", trackTitleEn: "Wanderer", trackTitleDe: "Wanderer", descriptionEn: "A pentatonic raga of joy and wandering. Bhupali's five-note scale creates a sense of open space and freedom, evoking the image of a wanderer moving through a vast landscape.", descriptionDe: "Ein pentatonischer Raga der Freude und des Wanderns. Bhupalis Fünftonleiter schafft ein Gefühl von offenem Raum und Freiheit.", sortOrder: 7 },
  { ragaName: "Raga Darbari Kanada", trackTitleEn: "Surrender", trackTitleDe: "Hingabe", descriptionEn: "A late-night raga of grandeur and surrender. Darbari Kanada is one of the most majestic ragas in Hindustani music, associated with the courts of the Mughal emperors. Its slow, deliberate unfolding demands complete surrender from both performer and listener.", descriptionDe: "Ein Spätnacht-Raga der Erhabenheit und Hingabe. Darbari Kanada ist einer der majestätischsten Ragas der Hindustani-Musik, verbunden mit den Höfen der Mogulkaiser.", sortOrder: 8 },
  { ragaName: "Raga Bhairavi", trackTitleEn: "Essence", trackTitleDe: "Essenz", descriptionEn: "The farewell raga, traditionally performed at the end of a concert. Bhairavi is the raga of completeness and acceptance, its all-flat scale encompassing the full emotional range of human experience — joy, sorrow, longing, and peace.", descriptionDe: "Der Abschied-Raga, traditionell am Ende eines Konzerts gespielt. Bhairavi ist der Raga der Vollständigkeit und Akzeptanz, seine Tonleiter umfasst die gesamte emotionale Bandbreite menschlicher Erfahrung.", sortOrder: 9 },
];

for (const r of ragasData) {
  await db.insert(ragaDescriptions).values(r).onDuplicateKeyUpdate({ set: { descriptionEn: r.descriptionEn } });
}
console.log("✅ Raga descriptions seeded");

console.log("\n🎵 Database seeded successfully!");
await connection.end();

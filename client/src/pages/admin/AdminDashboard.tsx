import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Music, Users, Star, MapPin, Image, Radio, BookOpen } from "lucide-react";

export default function AdminDashboard() {
  const { data: tracks = [] } = trpc.content.getTracks.useQuery();
  const { data: musicians = [] } = trpc.content.getMusicians.useQuery();
  const { data: reviews = [] } = trpc.content.getPressReviews.useQuery();
  const { data: tourDates = [] } = trpc.content.getTourDates.useQuery();
  const { data: gallery = [] } = trpc.content.getGalleryImages.useQuery();
  const { data: streaming = [] } = trpc.content.getStreamingLinks.useQuery();
  const { data: ragas = [] } = trpc.content.getRagaDescriptions.useQuery();

  const stats = [
    { label: "Tracks", count: tracks.length, icon: Music, path: "/admin/tracks" },
    { label: "Musicians", count: musicians.length, icon: Users, path: "/admin/musicians" },
    { label: "Press Reviews", count: reviews.length, icon: Star, path: "/admin/reviews" },
    { label: "Tour Dates", count: tourDates.length, icon: MapPin, path: "/admin/tour" },
    { label: "Gallery Images", count: gallery.length, icon: Image, path: "/admin/gallery" },
    { label: "Streaming Links", count: streaming.length, icon: Radio, path: "/admin/streaming" },
    { label: "Raga Descriptions", count: ragas.length, icon: BookOpen, path: "/admin/ragas" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-cream mb-1">Dashboard</h1>
        <p className="text-cream-dim/60 font-mono text-xs">Manage all content for the Essence of Duality website</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.path} href={s.path}>
              <div className="p-5 border border-gold/15 hover:border-gold/40 bg-card transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-3">
                  <Icon size={16} className="text-gold/50 group-hover:text-gold transition-colors" />
                  <span className="font-mono text-2xl font-bold text-cream">{s.count}</span>
                </div>
                <p className="font-mono text-xs text-cream-dim/60 group-hover:text-cream-dim transition-colors">{s.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="border border-gold/10 p-6 bg-card">
        <h2 className="font-serif text-xl text-cream mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Edit Site Content & Texts", path: "/admin/content" },
            { label: "Manage Tracks", path: "/admin/tracks" },
            { label: "Manage Musicians", path: "/admin/musicians" },
            { label: "Manage Press Reviews", path: "/admin/reviews" },
            { label: "Manage Tour Dates", path: "/admin/tour" },
            { label: "Manage Gallery", path: "/admin/gallery" },
            { label: "Streaming Links", path: "/admin/streaming" },
            { label: "Raga Descriptions", path: "/admin/ragas" },
            { label: "Section Visibility", path: "/admin/sections" },
          ].map((link) => (
            <Link key={link.path} href={link.path}>
              <div className="px-4 py-3 border border-gold/10 hover:border-gold/30 hover:bg-gold/5 transition-all cursor-pointer">
                <p className="font-mono text-xs text-cream-dim/70 hover:text-cream">{link.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

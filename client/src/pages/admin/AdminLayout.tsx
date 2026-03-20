import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { Music, Users, Star, MapPin, Image, Radio, BookOpen, LayoutGrid, FileText, BarChart3, LogOut, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: BarChart3, exact: true },
  { path: "/admin/content", label: "Site Content", icon: FileText },
  { path: "/admin/tracks", label: "Tracks", icon: Music },
  { path: "/admin/musicians", label: "Musicians", icon: Users },
  { path: "/admin/reviews", label: "Press Reviews", icon: Star },
  { path: "/admin/tour", label: "Tour Dates", icon: MapPin },
  { path: "/admin/gallery", label: "Gallery", icon: Image },
  { path: "/admin/streaming", label: "Streaming Links", icon: Radio },
  { path: "/admin/ragas", label: "Ragas", icon: BookOpen },
  { path: "/admin/sections", label: "Sections", icon: LayoutGrid },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  // useLocation returns the path relative to the current router base.
  // We use window.location.pathname directly to get the true absolute path
  // so active-link detection works correctly regardless of wouter nesting.
  const absolutePath = typeof window !== "undefined" ? window.location.pathname : "/";
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => { window.location.href = "/"; },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gold font-mono text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-px bg-gold/40 mx-auto mb-8" />
          <h1 className="font-serif text-3xl text-cream mb-3">Admin Access</h1>
          <p className="text-cream-dim text-sm mb-8">Sign in to manage the Essence of Duality website content.</p>
          <a href={getLoginUrl()} className="inline-block px-8 py-3 bg-gold text-black font-mono text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-all">
            Sign In
          </a>
          <div className="mt-6">
            <a href="/" className="font-mono text-xs text-gold/40 hover:text-gold transition-colors">← Back to site</a>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-cream mb-3">Access Denied</h1>
          <p className="text-cream-dim text-sm mb-6">Your account does not have admin privileges.</p>
          <a href="/" className="font-mono text-xs text-gold/40 hover:text-gold transition-colors">← Back to site</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[oklch(0.10_0.008_60)] border-r border-gold/10 flex flex-col">
        <div className="p-5 border-b border-gold/10">
          <p className="font-mono text-xs text-gold/50 tracking-widest uppercase mb-1">Admin Panel</p>
          <p className="font-serif text-sm text-cream italic">Essence of Duality</p>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            // Use absolute path from window for reliable active detection
            const isActive = item.exact
              ? absolutePath === item.path
              : absolutePath.startsWith(item.path) && item.path !== "/admin";
            const Icon = item.icon;
            return (
              // Use native anchor tags to bypass wouter's base-path prepending entirely
              <a key={item.path} href={item.path}>
                <div className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all cursor-pointer ${
                  isActive
                    ? "bg-gold/10 text-gold border-r-2 border-gold"
                    : "text-cream-dim/70 hover:text-cream hover:bg-white/5"
                }`}>
                  <Icon size={14} className="shrink-0" />
                  <span className="font-mono text-xs">{item.label}</span>
                </div>
              </a>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gold/10 space-y-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-cream-dim/50 hover:text-gold text-xs font-mono transition-colors">
            <ExternalLink size={12} />
            View Site
          </a>
          <button
            onClick={() => logout.mutate()}
            className="flex items-center gap-2 px-3 py-2 text-cream-dim/50 hover:text-destructive text-xs font-mono transition-colors w-full">
            <LogOut size={12} />
            Sign Out
          </button>
          <div className="px-3 pt-1">
            <p className="font-mono text-xs text-cream-dim/30 truncate">{user?.name || user?.email}</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

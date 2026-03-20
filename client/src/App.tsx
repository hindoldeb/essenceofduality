import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import PublicSite from "./pages/PublicSite";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminContent from "./pages/admin/AdminContent";
import AdminTracks from "./pages/admin/AdminTracks";
import AdminMusicians from "./pages/admin/AdminMusicians";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminTourDates from "./pages/admin/AdminTourDates";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminStreaming from "./pages/admin/AdminStreaming";
import AdminRagas from "./pages/admin/AdminRagas";
import AdminSections from "./pages/admin/AdminSections";

function AdminRouter() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/content" component={AdminContent} />
        <Route path="/admin/tracks" component={AdminTracks} />
        <Route path="/admin/musicians" component={AdminMusicians} />
        <Route path="/admin/reviews" component={AdminReviews} />
        <Route path="/admin/tour" component={AdminTourDates} />
        <Route path="/admin/gallery" component={AdminGallery} />
        <Route path="/admin/streaming" component={AdminStreaming} />
        <Route path="/admin/ragas" component={AdminRagas} />
        <Route path="/admin/sections" component={AdminSections} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={PublicSite} />
      <Route path="/admin" component={AdminRouter} />
      <Route path="/admin/:rest*" component={AdminRouter} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

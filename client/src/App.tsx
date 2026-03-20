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

function Router() {
  return (
    <Switch>
      <Route path="/" component={PublicSite} />
      <Route path="/admin" nest>
        <AdminLayout>
          <Switch>
            <Route path="/" component={AdminDashboard} />
            <Route path="/content" component={AdminContent} />
            <Route path="/tracks" component={AdminTracks} />
            <Route path="/musicians" component={AdminMusicians} />
            <Route path="/reviews" component={AdminReviews} />
            <Route path="/tour" component={AdminTourDates} />
            <Route path="/gallery" component={AdminGallery} />
            <Route path="/streaming" component={AdminStreaming} />
            <Route path="/ragas" component={AdminRagas} />
            <Route path="/sections" component={AdminSections} />
            <Route component={NotFound} />
          </Switch>
        </AdminLayout>
      </Route>
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

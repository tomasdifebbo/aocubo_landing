import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Comprar from "./pages/Comprar";
import PropertyDetails from "./pages/PropertyDetails";
import Favoritos from "./pages/Favoritos";
import Sobre from "./pages/Sobre";
import ScrollToTop from "./components/ScrollToTop";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/comprar"} component={Comprar} />
      <Route path={"/favoritos"} component={Favoritos} />
      <Route path={"/imovel/:slug"} component={PropertyDetails} />
      <Route path={"/sobre"} component={Sobre} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      // switchable
      >
        <AuthProvider>
          <TooltipProvider>
            <ScrollToTop />
            <Toaster position="top-right" closeButton richColors />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

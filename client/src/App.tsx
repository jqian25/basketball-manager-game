import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Match from "./pages/Match";
import MatchPlay from "./pages/MatchPlay";
import PlayerManage from "./pages/PlayerManage";
import QuickMatch from "./pages/QuickMatch";
import OpenWorld from "./pages/OpenWorld";
import KairoGame from "./pages/KairoGame";
import ModernManager from "./pages/ModernManager";
import PixelRPG from "./pages/PixelRPG";
import BasketballRPG from "./pages/BasketballRPG";
import KairoBasketball from "./pages/KairoBasketball";
import PokemonBasketball from "./pages/PokemonBasketball";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/game"} component={Game} />
      <Route path={"/match"} component={Match} />
      <Route path={"/match/quick"} component={QuickMatch} />
      <Route path={"/match/play"} component={MatchPlay} />
      <Route path={"/players"} component={PlayerManage} />
      <Route path={"/openworld"} component={OpenWorld} />
      <Route path={"/kairo"} component={KairoGame} />
      <Route path={"/modern"} component={ModernManager} />
      <Route path={"/rpg"} component={PixelRPG} />
      <Route path={"/basketball-rpg"} component={BasketballRPG} />
      <Route path={"/kairo-basketball"} component={KairoBasketball} />
      <Route path={"/pokemon-basketball"} component={PokemonBasketball} />
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
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

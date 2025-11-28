import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TournamentProvider } from "./contexts/TournamentContext";
import { Navigation } from "./components/Navigation";
import { PasswordProtection } from "./components/PasswordProtection";
import { ChristmasSnow } from "./components/ChristmasSnow";
import Dashboard from "./pages/Dashboard";
import Setup from "./pages/Setup";
import Scores from "./pages/Scores";
import History from "./pages/History";
import GenerateTeams from "./pages/GenerateTeams";
import FormatSelection from "./pages/FormatSelection";
import Predictions from "./pages/Predictions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showChristmas, setShowChristmas] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('fotbalek-auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    const christmasMode = localStorage.getItem('christmas-mode');
    setShowChristmas(christmasMode === 'true');

    const handleChristmasChange = (e: CustomEvent<boolean>) => {
      setShowChristmas(e.detail);
    };

    window.addEventListener('christmas-mode-change', handleChristmasChange as EventListener);
    return () => {
      window.removeEventListener('christmas-mode-change', handleChristmasChange as EventListener);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <PasswordProtection onSuccess={() => setIsAuthenticated(true)} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TournamentProvider>
          <Toaster />
          <Sonner />
          {showChristmas && <ChristmasSnow />}
          <BrowserRouter>
            <Navigation />
            <Routes>
              <Route path="/" element={<FormatSelection />} />
              <Route path="/generate-teams" element={<GenerateTeams />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scores" element={<Scores />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/history" element={<History />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TournamentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

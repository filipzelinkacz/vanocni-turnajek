import { useTournament } from '@/contexts/TournamentContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Maximize2, StopCircle } from 'lucide-react';
import { StandingsTable } from '@/components/StandingsTable';
import { RecentMatches } from '@/components/RecentMatches';
import { UpcomingMatches } from '@/components/UpcomingMatches';
import { GoalStats } from '@/components/GoalStats';
import marketupLogo from '@/assets/marketup-logo.png';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const Dashboard = () => {
  const { tournament, endTournamentEarly } = useTournament();

  const handleFullscreen = () => {
    document.documentElement.requestFullscreen();
  };
  
  const handleEndTournament = () => {
    endTournamentEarly();
    toast.success('Turnaj byl předčastně ukončen a archivován');
  };

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-secondary">
        <Card className="p-12 text-center max-w-lg">
          <img src={marketupLogo} alt="Marketup" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4 text-primary">Vánoční Fotbálek</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Vytvořte turnaj pro zahájení zápasů
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
            <a href="/setup">Vytvořit turnaj</a>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-winter via-background to-winter/50 p-6 pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <img src={marketupLogo} alt="Marketup" className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold text-primary">{tournament.name}</h1>
              <p className="text-muted-foreground">
                {tournament.format === 'round-robin' ? 'Každý s každým' : 'Dvě skupiny A/B'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="lg" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <StopCircle className="w-5 h-5 mr-2" />
                  Ukončit turnaj
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Předčasně ukončit turnaj?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Turnaj bude archivován do historie. Tato akce je nevratná.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Zrušit</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEndTournament} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Ukončit turnaj
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button onClick={handleFullscreen} variant="outline" size="lg">
              <Maximize2 className="w-5 h-5 mr-2" />
              Celá obrazovka
            </Button>
          </div>
        </div>
        
        <Card className="p-4 bg-success/10 border-success/20">
          <p className="text-sm font-medium text-center text-success">
            <span className="font-bold">Bodový systém:</span> Výhra = 1 bod | Pořadí dle: 1. počet bodů, 2. rozdíl skóre
          </p>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Standings */}
          <div className="lg:col-span-2 space-y-6">
            <StandingsTable />
            <RecentMatches />
          </div>

          {/* Right Column - Upcoming */}
          <div className="space-y-6">
            <UpcomingMatches />
          </div>
        </div>
        
        <GoalStats />
      </div>
    </div>
  );
};

export default Dashboard;

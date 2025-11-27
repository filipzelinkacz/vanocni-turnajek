import { useTournament } from '@/contexts/TournamentContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Maximize2, Snowflake } from 'lucide-react';
import { StandingsTable } from '@/components/StandingsTable';
import { RecentMatches } from '@/components/RecentMatches';
import { LiveMatch } from '@/components/LiveMatch';
import { UpcomingMatches } from '@/components/UpcomingMatches';

const Dashboard = () => {
  const { tournament } = useTournament();

  const handleFullscreen = () => {
    document.documentElement.requestFullscreen();
  };

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-secondary">
        <Card className="p-12 text-center max-w-lg">
          <Snowflake className="w-16 h-16 mx-auto mb-6 text-accent animate-pulse" />
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
    <div className="min-h-screen bg-gradient-to-br from-winter via-background to-winter/50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Snowflake className="w-10 h-10 text-accent" />
            <div>
              <h1 className="text-4xl font-bold text-primary">{tournament.name}</h1>
              <p className="text-muted-foreground">
                {tournament.format === 'round-robin' ? 'Každý s každým' : 'Dvě skupiny A/B'}
              </p>
            </div>
          </div>
          <Button onClick={handleFullscreen} variant="outline" size="lg">
            <Maximize2 className="w-5 h-5 mr-2" />
            Celá obrazovka
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-3">
        {/* Left Column - Standings */}
        <div className="lg:col-span-2 space-y-6">
          <StandingsTable />
          <RecentMatches />
        </div>

        {/* Right Column - Live & Upcoming */}
        <div className="space-y-6">
          {tournament && <LiveMatch />}
          <UpcomingMatches />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

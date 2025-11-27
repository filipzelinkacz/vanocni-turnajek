import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

export const UpcomingMatches = () => {
  const { upcomingMatches, getTeamById } = useTournament();

  if (upcomingMatches.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <CalendarDays className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-primary">Nadcházející zápasy</h2>
      </div>

      <div className="space-y-3">
        {upcomingMatches.map(match => {
          const teamA = getTeamById(match.teamAId);
          const teamB = getTeamById(match.teamBId);
          if (!teamA || !teamB) return null;

          return (
            <div
              key={match.id}
              className="p-3 bg-muted/30 rounded-lg"
            >
              <div className="text-center">
                <div className="font-semibold">{teamA.name}</div>
                <div className="text-sm text-muted-foreground my-1">vs</div>
                <div className="font-semibold">{teamB.name}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

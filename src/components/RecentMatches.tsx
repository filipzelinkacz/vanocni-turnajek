import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export const RecentMatches = () => {
  const { recentMatches, getTeamById } = useTournament();

  if (recentMatches.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-6 h-6 text-secondary" />
        <h2 className="text-2xl font-bold text-primary">Poslední výsledky</h2>
      </div>

      <div className="space-y-3">
        {recentMatches.map(match => {
          const teamA = getTeamById(match.teamAId);
          const teamB = getTeamById(match.teamBId);
          if (!teamA || !teamB) return null;

          const winner = match.scoreA > match.scorB ? teamA : teamB;

          return (
            <div
              key={match.id}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
            >
              <div className="flex-1 text-right">
                <div className="font-semibold text-lg">{teamA.name}</div>
                {teamA.player1 && (
                  <div className="text-sm text-muted-foreground">
                    {[teamA.player1, teamA.player2].filter(Boolean).join(' & ')}
                  </div>
                )}
              </div>
              
              <div className="px-8">
                <div className="text-3xl font-bold text-center">
                  <span className={match.scoreA > match.scorB ? 'text-success' : ''}>
                    {match.scoreA}
                  </span>
                  <span className="text-muted-foreground mx-2">:</span>
                  <span className={match.scorB > match.scoreA ? 'text-success' : ''}>
                    {match.scorB}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div className="font-semibold text-lg">{teamB.name}</div>
                {teamB.player1 && (
                  <div className="text-sm text-muted-foreground">
                    {[teamB.player1, teamB.player2].filter(Boolean).join(' & ')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

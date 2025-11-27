import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';

export const LiveMatch = () => {
  const { liveMatch, getTeamById } = useTournament();

  if (!liveMatch) {
    return null;
  }

  const teamA = getTeamById(liveMatch.teamAId);
  const teamB = getTeamById(liveMatch.teamBId);

  if (!teamA || !teamB) return null;

  return (
    <Card className="p-6 christmas-glow border-2 border-accent">
      <div className="flex items-center gap-3 mb-4">
        <Zap className="w-6 h-6 text-accent animate-pulse" />
        <h2 className="text-2xl font-bold text-accent">ŽIVĚ</h2>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">{teamA.name}</div>
          {teamA.player1 && (
            <div className="text-sm text-muted-foreground">
              {[teamA.player1, teamA.player2].filter(Boolean).join(' & ')}
            </div>
          )}
        </div>

        <div className="text-center">
          <div className="text-6xl font-bold text-primary">
            {liveMatch.scoreA} : {liveMatch.scorB}
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold mb-2">{teamB.name}</div>
          {teamB.player1 && (
            <div className="text-sm text-muted-foreground">
              {[teamB.player1, teamB.player2].filter(Boolean).join(' & ')}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

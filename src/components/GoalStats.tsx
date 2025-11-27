import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const GoalStats = () => {
  const { standings, getTeamById } = useTournament();

  if (standings.length === 0) return null;

  const topScorer = [...standings].sort((a, b) => b.goalsFor - a.goalsFor)[0];
  const mostConceded = [...standings].sort((a, b) => b.goalsAgainst - a.goalsAgainst)[0];

  const topScorerTeam = getTeamById(topScorer.teamId);
  const mostConcededTeam = getTeamById(mostConceded.teamId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className="w-5 h-5 text-success" />
          <h3 className="font-bold text-lg">Nejlepší útok</h3>
        </div>
        {topScorerTeam && (
          <div>
            <p className="text-2xl font-bold text-success">{topScorerTeam.name}</p>
            <p className="text-muted-foreground text-sm">
              {topScorer.goalsFor} vstřelených gólů
            </p>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <TrendingDown className="w-5 h-5 text-destructive" />
          <h3 className="font-bold text-lg">Nejhorší obrana</h3>
        </div>
        {mostConcededTeam && (
          <div>
            <p className="text-2xl font-bold text-destructive">{mostConcededTeam.name}</p>
            <p className="text-muted-foreground text-sm">
              {mostConceded.goalsAgainst} obdržených gólů
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

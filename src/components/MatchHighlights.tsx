import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Flame, TrendingUp, Award } from 'lucide-react';

export const MatchHighlights = () => {
  const { tournament, getTeamById } = useTournament();

  if (!tournament) return null;

  const finishedMatches = tournament.matches.filter(m => m.status === 'finished');

  if (finishedMatches.length === 0) return null;

  // Find match with most goals
  const matchWithMostGoals = finishedMatches.reduce((max, match) => {
    const totalGoals = match.scoreA + match.scorB;
    const maxGoals = max.scoreA + max.scorB;
    return totalGoals > maxGoals ? match : max;
  });

  // Find match with biggest score difference
  const matchWithBiggestDifference = finishedMatches.reduce((max, match) => {
    const diff = Math.abs(match.scoreA - match.scorB);
    const maxDiff = Math.abs(max.scoreA - max.scorB);
    return diff > maxDiff ? match : max;
  });

  const teamAMostGoals = getTeamById(matchWithMostGoals.teamAId);
  const teamBMostGoals = getTeamById(matchWithMostGoals.teamBId);
  
  const teamABiggestDiff = getTeamById(matchWithBiggestDifference.teamAId);
  const teamBBiggestDiff = getTeamById(matchWithBiggestDifference.teamBId);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
        <Award className="w-6 h-6" />
        Zajímavosti turnaje
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Most Goals */}
        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
          <div className="flex items-center gap-3 mb-3">
            <Flame className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-bold text-primary">Zápas večera</h3>
          </div>
          <div className="text-sm text-muted-foreground mb-2">Nejvíce gólů v jednom zápase</div>
          <div className="flex items-center justify-center gap-4 py-3">
            <div className="text-center">
              <div className="font-medium text-primary">{teamAMostGoals?.name}</div>
            </div>
            <div className="text-3xl font-bold text-accent">
              {matchWithMostGoals.scoreA} : {matchWithMostGoals.scorB}
            </div>
            <div className="text-center">
              <div className="font-medium text-primary">{teamBMostGoals?.name}</div>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Celkem {matchWithMostGoals.scoreA + matchWithMostGoals.scorB} gólů
          </div>
        </Card>

        {/* Biggest Difference */}
        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-bold text-primary">Největší rozdíl</h3>
          </div>
          <div className="text-sm text-muted-foreground mb-2">Nejvyšší rozdíl ve skóre</div>
          <div className="flex items-center justify-center gap-4 py-3">
            <div className="text-center">
              <div className="font-medium text-primary">{teamABiggestDiff?.name}</div>
            </div>
            <div className="text-3xl font-bold text-accent">
              {matchWithBiggestDifference.scoreA} : {matchWithBiggestDifference.scorB}
            </div>
            <div className="text-center">
              <div className="font-medium text-primary">{teamBBiggestDiff?.name}</div>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Rozdíl {Math.abs(matchWithBiggestDifference.scoreA - matchWithBiggestDifference.scorB)} gólů
          </div>
        </Card>
      </div>
    </div>
  );
};

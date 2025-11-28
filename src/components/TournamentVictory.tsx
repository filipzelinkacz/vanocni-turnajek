import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, TrendingUp, Target } from 'lucide-react';
import { StandingsTable } from './StandingsTable';
import { GoalStats } from './GoalStats';

export const TournamentVictory = () => {
  const { tournament, getTeamById, standings, archiveTournament } = useTournament();

  if (!tournament) return null;

  const finalMatch = tournament.matches.find(m => m.group === 'final');
  const thirdPlaceMatch = tournament.matches.find(m => m.group === 'third-place');

  if (!finalMatch || finalMatch.status !== 'finished') return null;

  const winnerId = finalMatch.scoreA > finalMatch.scorB ? finalMatch.teamAId : finalMatch.teamBId;
  const runnerUpId = finalMatch.scoreA > finalMatch.scorB ? finalMatch.teamBId : finalMatch.teamAId;
  
  const winner = getTeamById(winnerId);
  const runnerUp = getTeamById(runnerUpId);

  let thirdPlace;
  if (thirdPlaceMatch && thirdPlaceMatch.status === 'finished') {
    const thirdPlaceId = thirdPlaceMatch.scoreA > thirdPlaceMatch.scorB 
      ? thirdPlaceMatch.teamAId 
      : thirdPlaceMatch.teamBId;
    thirdPlace = getTeamById(thirdPlaceId);
  }

  const totalMatches = tournament.matches.filter(m => m.status === 'finished').length;
  const totalGoals = tournament.matches
    .filter(m => m.status === 'finished')
    .reduce((sum, m) => sum + m.scoreA + m.scorB, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Victory Banner */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-accent/20 via-primary/10 to-accent/20 border-accent/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="relative p-12 text-center">
          <Trophy className="w-24 h-24 mx-auto mb-6 text-accent animate-pulse" />
          <h1 className="text-5xl font-bold mb-4 text-primary">
            🎉 Gratulujeme vítězům! 🎉
          </h1>
          <div className="text-3xl font-bold text-accent mb-2">
            {winner?.name}
          </div>
          {winner?.player1 && (
            <div className="text-xl text-muted-foreground">
              {[winner.player1, winner.player2].filter(Boolean).join(' & ')}
            </div>
          )}
        </div>
      </Card>

      {/* Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 2nd Place */}
        {runnerUp && (
          <Card className="p-6 text-center bg-gradient-to-b from-slate-300/20 to-transparent">
            <Medal className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <div className="text-4xl font-bold mb-2">2.</div>
            <div className="text-xl font-bold text-primary mb-1">{runnerUp.name}</div>
            {runnerUp.player1 && (
              <div className="text-sm text-muted-foreground">
                {[runnerUp.player1, runnerUp.player2].filter(Boolean).join(' & ')}
              </div>
            )}
          </Card>
        )}

        {/* 1st Place */}
        {winner && (
          <Card className="p-8 text-center bg-gradient-to-b from-yellow-300/30 to-transparent border-yellow-500/50 md:-mt-4">
            <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-500" />
            <div className="text-5xl font-bold mb-2">1.</div>
            <div className="text-2xl font-bold text-primary mb-2">{winner.name}</div>
            {winner.player1 && (
              <div className="text-sm text-muted-foreground">
                {[winner.player1, winner.player2].filter(Boolean).join(' & ')}
              </div>
            )}
          </Card>
        )}

        {/* 3rd Place */}
        {thirdPlace && (
          <Card className="p-6 text-center bg-gradient-to-b from-amber-600/20 to-transparent">
            <Award className="w-16 h-16 mx-auto mb-4 text-amber-600" />
            <div className="text-4xl font-bold mb-2">3.</div>
            <div className="text-xl font-bold text-primary mb-1">{thirdPlace.name}</div>
            {thirdPlace.player1 && (
              <div className="text-sm text-muted-foreground">
                {[thirdPlace.player1, thirdPlace.player2].filter(Boolean).join(' & ')}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Tournament Statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-bold text-primary">Celkem zápasů</h3>
          </div>
          <div className="text-4xl font-bold text-accent">{totalMatches}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-bold text-primary">Celkem gólů</h3>
          </div>
          <div className="text-4xl font-bold text-accent">{totalGoals}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-bold text-primary">Průměr gólů/zápas</h3>
          </div>
          <div className="text-4xl font-bold text-accent">
            {totalMatches > 0 ? (totalGoals / totalMatches).toFixed(1) : 0}
          </div>
        </Card>
      </div>

      {/* Goal Statistics */}
      <GoalStats />

      {/* Final Standings */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Konečná tabulka skupinové části
        </h2>
        <StandingsTable />
      </div>

      {/* Archive Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={archiveTournament}
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          Archivovat turnaj
        </Button>
      </div>
    </div>
  );
};

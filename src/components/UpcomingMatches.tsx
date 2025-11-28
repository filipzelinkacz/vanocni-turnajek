import { useState } from 'react';
import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarDays, Save } from 'lucide-react';
import { toast } from 'sonner';

export const UpcomingMatches = () => {
  const { upcomingMatches, getTeamById, updateMatchScore, finishMatch } = useTournament();
  const [scoreA, setScoreA] = useState('0');
  const [scoreB, setScoreB] = useState('0');
  
  // Show only scheduled matches (not finished)
  const scheduledMatches = upcomingMatches.filter(m => m.status === 'scheduled');

  // Show only the first scheduled match
  const nextMatch = scheduledMatches[0];

  if (!nextMatch) {
    return null;
  }

  const teamA = getTeamById(nextMatch.teamAId);
  const teamB = getTeamById(nextMatch.teamBId);

  if (!teamA || !teamB) return null;

  const handleSaveScore = () => {
    const numA = parseInt(scoreA);
    const numB = parseInt(scoreB);

    if (isNaN(numA) || isNaN(numB) || numA < 0 || numB < 0) {
      toast.error('Neplatné skóre');
      return;
    }

    if (numA === numB) {
      toast.error('Zápas nemůže skončit remízou');
      return;
    }

    updateMatchScore(nextMatch.id, numA, numB);
    finishMatch(nextMatch.id);
    setScoreA('0');
    setScoreB('0');
    toast.success('Skóre uloženo');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <CalendarDays className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-primary">Nadcházející zápas</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* Team A */}
          <div className="text-right">
            <div className="text-lg font-bold">{teamA.name}</div>
            {teamA.player1 && (
              <div className="text-xs text-muted-foreground">
                {[teamA.player1, teamA.player2].filter(Boolean).join(' & ')}
              </div>
            )}
          </div>

          {/* Score Inputs */}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="99"
              value={scoreA}
              onChange={(e) => setScoreA(e.target.value)}
              className="w-16 text-center text-xl font-bold"
            />
            <span className="text-xl font-bold">:</span>
            <Input
              type="number"
              min="0"
              max="99"
              value={scoreB}
              onChange={(e) => setScoreB(e.target.value)}
              className="w-16 text-center text-xl font-bold"
            />
          </div>

          {/* Team B */}
          <div>
            <div className="text-lg font-bold">{teamB.name}</div>
            {teamB.player1 && (
              <div className="text-xs text-muted-foreground">
                {[teamB.player1, teamB.player2].filter(Boolean).join(' & ')}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleSaveScore} className="bg-accent hover:bg-accent/90">
            <Save className="w-4 h-4 mr-2" />
            Uložit skóre
          </Button>
        </div>
      </div>
    </Card>
  );
};

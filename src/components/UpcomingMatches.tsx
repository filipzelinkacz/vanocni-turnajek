import { useState } from 'react';
import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarDays, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { Match } from '@/types/tournament';

export const UpcomingMatches = () => {
  const { upcomingMatches, getTeamById, updateMatchScore, finishMatch } = useTournament();
  const [scores, setScores] = useState<Record<string, { a: string; b: string }>>({});
  
  // Show all scheduled matches (not finished)
  const scheduledMatches = upcomingMatches.filter(m => m.status === 'scheduled');

  if (scheduledMatches.length === 0) {
    return null;
  }

  const handleSaveScore = (match: Match) => {
    const current = scores[match.id] ?? {
      a: match.scoreA.toString(),
      b: match.scorB.toString(),
    };

    const numA = parseInt(current.a);
    const numB = parseInt(current.b);

    if (isNaN(numA) || isNaN(numB) || numA < 0 || numB < 0) {
      toast.error('Neplatné skóre');
      return;
    }

    if (numA === numB) {
      toast.error('Zápas nemůže skončit remízou');
      return;
    }

    updateMatchScore(match.id, numA, numB);
    finishMatch(match.id);

    setScores(prev => {
      const copy = { ...prev };
      delete copy[match.id];
      return copy;
    });

    toast.success('Skóre uloženo');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <CalendarDays className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-primary">Nadcházející zápasy</h2>
      </div>

      <div className="space-y-3">
        {scheduledMatches.map(match => {
          const teamA = getTeamById(match.teamAId);
          const teamB = getTeamById(match.teamBId);
          if (!teamA || !teamB) return null;

          const current = scores[match.id] ?? {
            a: match.scoreA.toString(),
            b: match.scorB.toString(),
          };

          return (
            <div
              key={match.id}
              className="p-3 bg-muted/30 rounded-lg"
            >
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                {/* Team A */}
                <div className="text-right">
                  <div className="font-semibold">{teamA.name}</div>
                  {teamA.player1 && (
                    <div className="text-xs text-muted-foreground">
                      {[teamA.player1, teamA.player2].filter(Boolean).join(' & ')}
                    </div>
                  )}
                </div>

                {/* Score inputs */}
                <div className="flex items-center justify-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="99"
                    value={current.a}
                    onChange={(e) =>
                      setScores(prev => ({
                        ...prev,
                        [match.id]: { ...prev[match.id], a: e.target.value },
                      }))
                    }
                    className="w-16 text-center text-lg font-bold"
                  />
                  <span className="text-lg font-bold">:</span>
                  <Input
                    type="number"
                    min="0"
                    max="99"
                    value={current.b}
                    onChange={(e) =>
                      setScores(prev => ({
                        ...prev,
                        [match.id]: { ...prev[match.id], b: e.target.value },
                      }))
                    }
                    className="w-16 text-center text-lg font-bold"
                  />
                </div>

                {/* Team B */}
                <div>
                  <div className="font-semibold">{teamB.name}</div>
                  {teamB.player1 && (
                    <div className="text-xs text-muted-foreground">
                      {[teamB.player1, teamB.player2].filter(Boolean).join(' & ')}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 flex justify-center">
                <Button
                  onClick={() => handleSaveScore(match)}
                  className="bg-accent hover:bg-accent/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Uložit skóre
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

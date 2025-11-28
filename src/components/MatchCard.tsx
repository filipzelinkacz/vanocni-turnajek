import { useState } from 'react';
import { useTournament } from '@/contexts/TournamentContext';
import { Match } from '@/types/tournament';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
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

interface MatchCardProps {
  match: Match;
}

export const MatchCard = ({ match }: MatchCardProps) => {
  const { getTeamById, updateMatchScore, finishMatch } = useTournament();
  const [scoreA, setScoreA] = useState(match.scoreA.toString());
  const [scoreB, setScoreB] = useState(match.scorB.toString());
  const [isEditing, setIsEditing] = useState(match.status === 'scheduled');

  const teamA = getTeamById(match.teamAId);
  const teamB = getTeamById(match.teamBId);

  if (!teamA || !teamB) return null;

  const handleSave = () => {
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

    updateMatchScore(match.id, numA, numB);
    finishMatch(match.id);
    setIsEditing(false);
    toast.success('Skóre uloženo');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setScoreA(match.scoreA.toString());
    setScoreB(match.scorB.toString());
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center">
        {/* Team A */}
        <div className="text-right">
          <div className="text-xl font-bold">{teamA.name}</div>
          {teamA.player1 && (
            <div className="text-sm text-muted-foreground">
              {[teamA.player1, teamA.player2].filter(Boolean).join(' & ')}
            </div>
          )}
        </div>

        {/* Score */}
        <div className="flex items-center gap-4">
          {isEditing ? (
            <>
              <Input
                type="number"
                min="0"
                max="99"
                value={scoreA}
                onChange={(e) => setScoreA(e.target.value)}
                className="w-20 text-center text-2xl font-bold"
              />
              <span className="text-2xl font-bold">:</span>
              <Input
                type="number"
                min="0"
                max="99"
                value={scoreB}
                onChange={(e) => setScoreB(e.target.value)}
                className="w-20 text-center text-2xl font-bold"
              />
            </>
          ) : match.status === 'finished' ? (
            <div className="text-4xl font-bold">
              <span className={match.scoreA > match.scorB ? 'text-success' : ''}>
                {match.scoreA}
              </span>
              <span className="mx-2">:</span>
              <span className={match.scorB > match.scoreA ? 'text-success' : ''}>
                {match.scorB}
              </span>
            </div>
          ) : (
            <div className="text-4xl font-bold text-muted-foreground">vs</div>
          )}
        </div>

        {/* Team B */}
        <div>
          <div className="text-xl font-bold">{teamB.name}</div>
          {teamB.player1 && (
            <div className="text-sm text-muted-foreground">
              {[teamB.player1, teamB.player2].filter(Boolean).join(' & ')}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-center gap-3">
        {isEditing && (
          <Button onClick={handleSave} className="bg-accent hover:bg-accent/90">
            <Save className="w-4 h-4 mr-2" />
            Uložit skóre
          </Button>
        )}

        {match.status === 'finished' && !isEditing && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Edit2 className="w-4 h-4 mr-2" />
                Upravit skóre
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Upravit skóre?</AlertDialogTitle>
                <AlertDialogDescription>
                  Opravdu chcete upravit skóre dokončeného zápasu?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Zrušit</AlertDialogCancel>
                <AlertDialogAction onClick={handleEdit}>
                  Upravit
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </Card>
  );
};

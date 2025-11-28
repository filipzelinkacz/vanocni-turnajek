import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Trophy, CheckCircle2, XCircle } from 'lucide-react';

export const PredictionResults = () => {
  const { tournament, predictions, getTeamById } = useTournament();

  if (!tournament || predictions.length === 0) return null;

  const finalMatch = tournament.matches.find(m => m.group === 'final' && m.status === 'finished');
  
  if (!finalMatch) return null;

  const winnerId = finalMatch.scoreA > finalMatch.scorB ? finalMatch.teamAId : finalMatch.teamBId;
  const winnerTeam = getTeamById(winnerId);

  const correctPredictions = predictions.filter(p => p.predictedTeamId === winnerId);
  const incorrectPredictions = predictions.filter(p => p.predictedTeamId !== winnerId);

  const successRate = (correctPredictions.length / predictions.length) * 100;

  return (
    <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20">
      <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-accent" />
        Výsledky tipovačky
      </h2>

      <div className="mb-6 p-4 bg-accent/10 rounded-lg text-center">
        <div className="text-sm text-muted-foreground mb-1">Vítězný tým</div>
        <div className="text-2xl font-bold text-accent">{winnerTeam?.name}</div>
        <div className="text-sm text-muted-foreground mt-2">
          Úspěšnost tipů: <span className="font-bold text-accent">{successRate.toFixed(0)}%</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Correct Predictions */}
        <div>
          <h3 className="text-lg font-bold text-success mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Správné tipy ({correctPredictions.length})
          </h3>
          <div className="space-y-2">
            {correctPredictions.map((prediction, idx) => (
              <div key={idx} className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="font-medium text-primary">{prediction.playerName}</div>
                <div className="text-sm text-muted-foreground">
                  Tipoval: {getTeamById(prediction.predictedTeamId)?.name}
                </div>
              </div>
            ))}
            {correctPredictions.length === 0 && (
              <div className="text-sm text-muted-foreground italic">
                Nikdo neuhodl správně 😅
              </div>
            )}
          </div>
        </div>

        {/* Incorrect Predictions */}
        <div>
          <h3 className="text-lg font-bold text-destructive mb-3 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Nesprávné tipy ({incorrectPredictions.length})
          </h3>
          <div className="space-y-2">
            {incorrectPredictions.map((prediction, idx) => (
              <div key={idx} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="font-medium text-primary">{prediction.playerName}</div>
                <div className="text-sm text-muted-foreground">
                  Tipoval: {getTeamById(prediction.predictedTeamId)?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

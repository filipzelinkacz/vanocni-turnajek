import { useState } from 'react';
import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trophy, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export const PredictionForm = () => {
  const { tournament, predictions, addPrediction, getTeamById } = useTournament();
  const [playerName, setPlayerName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');

  if (!tournament) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim() || !selectedTeamId) {
      toast.error('Vyplňte prosím všechna pole');
      return;
    }

    addPrediction(playerName.trim(), selectedTeamId);
    toast.success('Tip byl přidán!');
    setPlayerName('');
    setSelectedTeamId('');
  };

  // Calculate prediction statistics
  const predictionStats = tournament.teams.map(team => {
    const count = predictions.filter(p => p.predictedTeamId === team.id).length;
    const percentage = predictions.length > 0 ? (count / predictions.length) * 100 : 0;
    return { team, count, percentage };
  }).sort((a, b) => b.count - a.count);

  return (
    <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-accent" />
          Tipovačka vítěze turnaje
        </h2>
        <p className="text-muted-foreground">
          Tipujte, který tým vyhraje celý turnaj! Výsledky se ukážou na konci.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <Label htmlFor="playerName">Vaše jméno</Label>
          <Input
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Zadejte své jméno"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="teamSelect">Váš tip na vítěze</Label>
          <select
            id="teamSelect"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background"
          >
            <option value="">Vyberte tým...</option>
            {tournament.teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
          <Trophy className="w-4 h-4 mr-2" />
          Odeslat tip
        </Button>
      </form>

      {predictions.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Aktuální tipy ({predictions.length})
          </h3>
          <div className="space-y-2">
            {predictionStats.map(({ team, count, percentage }) => (
              count > 0 && (
                <div key={team.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <div className="font-medium text-primary">{team.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {count} {count === 1 ? 'tip' : count < 5 ? 'tipy' : 'tipů'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-accent">{percentage.toFixed(0)}%</div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

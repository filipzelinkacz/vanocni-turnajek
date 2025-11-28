import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trophy, TrendingUp, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

const Predictions = () => {
  const { tournament, predictions, addPrediction, getTeamById } = useTournament();
  const [playerName, setPlayerName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');

  if (!tournament) {
    return <Navigate to="/" replace />;
  }

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-accent" />
            Tipovačka vítěze turnaje
          </h1>
          <p className="text-muted-foreground text-lg">
            Tipujte, který tým vyhraje celý turnaj! Výsledky se ukážou na konci.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Add new prediction */}
          <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Přidat tip
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
          </Card>

          {/* Prediction statistics */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Aktuální tipy ({predictions.length})
            </h2>
            
            {predictions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Zatím nikdo netipoval</p>
              </div>
            ) : (
              <div className="space-y-2">
                {predictionStats.map(({ team, count, percentage }) => (
                  count > 0 && (
                    <div key={team.id} className="relative overflow-hidden rounded-lg bg-background/50 border border-border/50">
                      {/* Progress bar background */}
                      <div 
                        className="absolute inset-0 bg-accent/10 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                      
                      {/* Content */}
                      <div className="relative flex items-center justify-between p-3">
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
                    </div>
                  )
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* All predictions list */}
        {predictions.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-primary mb-4">
              Všechny tipy ({predictions.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {predictions.map((prediction, idx) => (
                <div key={idx} className="p-3 bg-muted/50 rounded-lg border border-border/50">
                  <div className="font-medium text-primary flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {prediction.playerName}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Tipuje: <span className="font-medium text-accent">{getTeamById(prediction.predictedTeamId)?.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(prediction.timestamp).toLocaleString('cs-CZ')}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Predictions;

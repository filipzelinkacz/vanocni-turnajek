import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournament } from '@/contexts/TournamentContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { Team } from '@/types/tournament';
import { toast } from 'sonner';
import marketupLogo from '@/assets/marketup-logo.png';

const Setup = () => {
  const navigate = useNavigate();
  const { tournament, createTournament, archiveTournament } = useTournament();
  
  const [name, setName] = useState('Vánoční Fotbálek 2025');
  const [teams, setTeams] = useState<Team[]>([
    { id: crypto.randomUUID(), name: '', player1: '', player2: '' },
    { id: crypto.randomUUID(), name: '', player1: '', player2: '' },
    { id: crypto.randomUUID(), name: '', player1: '', player2: '' },
    { id: crypto.randomUUID(), name: '', player1: '', player2: '' },
  ]);

  // Load generated teams from sessionStorage
  useEffect(() => {
    const generatedTeamsStr = sessionStorage.getItem('generatedTeams');
    if (generatedTeamsStr) {
      const generatedTeams = JSON.parse(generatedTeamsStr);
      setTeams(generatedTeams);
      sessionStorage.removeItem('generatedTeams');
    }
  }, []);

  const addTeam = () => {
    setTeams([...teams, { id: crypto.randomUUID(), name: '', player1: '', player2: '' }]);
  };

  const removeTeam = (id: string) => {
    if (teams.length <= 4) {
      toast.error('Minimální počet týmů je 4');
      return;
    }
    setTeams(teams.filter(t => t.id !== id));
  };

  const updateTeam = (id: string, field: keyof Team, value: string) => {
    setTeams(teams.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleCreate = () => {
    // Validation
    const validTeams = teams.filter(t => t.name.trim());
    if (validTeams.length < 4) {
      toast.error('Zadejte alespoň 4 týmy');
      return;
    }

    const uniqueNames = new Set(validTeams.map(t => t.name.trim().toLowerCase()));
    if (uniqueNames.size !== validTeams.length) {
      toast.error('Názvy týmů musí být jedinečné');
      return;
    }

    // Get format from sessionStorage
    const format = (sessionStorage.getItem('tournamentFormat') || 'round-robin') as any;
    sessionStorage.removeItem('tournamentFormat');

    // Archive existing tournament if there is one
    if (tournament) {
      archiveTournament();
    }

    createTournament(name, format, validTeams);
    toast.success('Turnaj vytvořen!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-winter via-background to-winter/50 p-6 pt-24 relative overflow-hidden">
      {/* Mountain background with blue filter */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920')] bg-cover bg-center opacity-20" 
           style={{ filter: 'sepia(100%) hue-rotate(190deg) saturate(150%)' }} />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg border-4 border-background relative overflow-hidden">
            <img src={marketupLogo} alt="Marketup" className="w-10 h-10 object-contain" />
            {/* Soccer ball pattern */}
            <div className="absolute inset-0 opacity-10" 
                 style={{
                   background: `repeating-conic-gradient(from 0deg, transparent 0deg 60deg, hsl(var(--primary-foreground)) 60deg 120deg)`
                 }} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-primary">Upravit a spustit</h1>
            <p className="text-muted-foreground">Krok 3: Zkontrolujte a upravte názvy týmů a hráče</p>
          </div>
        </div>

        <Card className="p-8 space-y-8">
          {/* Tournament Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Název turnaje</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg"
            />
          </div>

          {/* Teams */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Týmy ({teams.length})</Label>
              <Button onClick={addTeam} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Přidat tým
              </Button>
            </div>

            <div className="space-y-4">
              {teams.map((team, index) => (
                <Card key={team.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label className="text-sm">Tým {index + 1}</Label>
                        <Input
                          placeholder="Název týmu"
                          value={team.name}
                          onChange={(e) => updateTeam(team.id, 'name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Hráč 1 (nepovinné)"
                          value={team.player1}
                          onChange={(e) => updateTeam(team.id, 'player1', e.target.value)}
                        />
                        <Input
                          placeholder="Hráč 2 (nepovinné)"
                          value={team.player2}
                          onChange={(e) => updateTeam(team.id, 'player2', e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTeam(team.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Create Button */}
          <Button onClick={handleCreate} size="lg" className="w-full bg-accent hover:bg-accent/90">
            Vygenerovat zápasy a spustit turnaj
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Setup;

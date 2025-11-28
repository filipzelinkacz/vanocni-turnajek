import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Shuffle, ArrowRight } from 'lucide-react';
import { PlayerWithSkill, SkillLevel, GeneratedTeam } from '@/types/player';
import { generateBalancedTeams, getSkillLevelLabel, getSkillLevelColor } from '@/lib/team-generator';
import { toast } from 'sonner';
import marketupLogo from '@/assets/marketup-logo.png';

const GenerateTeams = () => {
  const navigate = useNavigate();
  const { createTournament } = useTournament();
  
  const [players, setPlayers] = useState<PlayerWithSkill[]>([
    { id: crypto.randomUUID(), name: '', skillLevel: 2 },
    { id: crypto.randomUUID(), name: '', skillLevel: 2 },
  ]);
  
  const [generatedTeams, setGeneratedTeams] = useState<GeneratedTeam[]>([]);

  const addPlayer = () => {
    setPlayers([...players, { id: crypto.randomUUID(), name: '', skillLevel: 2 }]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 2) {
      toast.error('Minimální počet hráčů je 2');
      return;
    }
    setPlayers(players.filter(p => p.id !== id));
  };

  const updatePlayer = (id: string, field: keyof PlayerWithSkill, value: string | SkillLevel) => {
    setPlayers(players.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleGenerate = () => {
    const validPlayers = players.filter(p => p.name.trim());
    
    if (validPlayers.length < 4) {
      toast.error('Zadejte alespoň 4 hráče');
      return;
    }
    
    if (validPlayers.length % 2 !== 0) {
      toast.error('Počet hráčů musí být sudý');
      return;
    }
    
    const uniqueNames = new Set(validPlayers.map(p => p.name.trim().toLowerCase()));
    if (uniqueNames.size !== validPlayers.length) {
      toast.error('Jména hráčů musí být jedinečná');
      return;
    }
    
    try {
      const teams = generateBalancedTeams(validPlayers);
      setGeneratedTeams(teams);
      toast.success('Týmy vygenerovány!');
    } catch (error) {
      toast.error('Chyba při generování týmů');
    }
  };

  const updateTeamName = (teamId: string, name: string) => {
    setGeneratedTeams(generatedTeams.map(t => t.id === teamId ? { ...t, name } : t));
  };

  const handleCreateTournament = () => {
    if (generatedTeams.length === 0) {
      toast.error('Nejdříve vygenerujte týmy');
      return;
    }
    
    const teams = generatedTeams.map(gt => ({
      id: gt.id,
      name: gt.name,
      player1: gt.player1.name,
      player2: gt.player2.name,
    }));
    
    createTournament('Vánoční Fotbálek 2025', 'round-robin', teams);
    toast.success('Turnaj vytvořen!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-winter via-background to-winter/50 p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <img src={marketupLogo} alt="Marketup" className="w-12 h-12" />
          <div>
            <h1 className="text-4xl font-bold text-primary">Generovat týmy</h1>
            <p className="text-muted-foreground">Vytvořte vyvážené týmy na základě úrovně hráčů</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Players Input */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Hráči ({players.length})</h2>
              <Button onClick={addPlayer} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Přidat hráče
              </Button>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {players.map((player, index) => (
                <Card key={player.id} className="p-3">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs">Hráč {index + 1}</Label>
                      <Input
                        placeholder="Jméno hráče"
                        value={player.name}
                        onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                      />
                    </div>
                    
                    <div className="w-48 space-y-2">
                      <Label className="text-xs">Úroveň</Label>
                      <Select
                        value={player.skillLevel.toString()}
                        onValueChange={(v) => updatePlayer(player.id, 'skillLevel', parseInt(v) as SkillLevel)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Dobrý</SelectItem>
                          <SelectItem value="2">2 - Průměr</SelectItem>
                          <SelectItem value="3">3 - Prostor pro zlepšení</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePlayer(player.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full mt-4 bg-accent hover:bg-accent/90"
              size="lg"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              Vygenerovat vyvážené týmy
            </Button>
          </Card>

          {/* Generated Teams */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Vygenerované týmy</h2>
              {generatedTeams.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {generatedTeams.length} týmů
                </span>
              )}
            </div>

            {generatedTeams.length === 0 ? (
              <div className="h-[600px] flex items-center justify-center text-center">
                <div>
                  <Shuffle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Zadejte hráče a klikněte na "Vygenerovat vyvážené týmy"
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
                  {generatedTeams.map((team, index) => (
                    <Card key={team.id} className="p-4 bg-card/50">
                      <div className="space-y-2">
                        <Input
                          value={team.name}
                          onChange={(e) => updateTeamName(team.id, e.target.value)}
                          className="font-semibold text-lg"
                        />
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Hráč 1:</span>
                            <span className="font-medium">{team.player1.name}</span>
                            <span className={`text-xs ${getSkillLevelColor(team.player1.skillLevel)}`}>
                              ({getSkillLevelLabel(team.player1.skillLevel)})
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Hráč 2:</span>
                            <span className="font-medium">{team.player2.name}</span>
                            <span className={`text-xs ${getSkillLevelColor(team.player2.skillLevel)}`}>
                              ({getSkillLevelLabel(team.player2.skillLevel)})
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Průměrná úroveň: {team.averageSkill.toFixed(1)}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Button 
                  onClick={handleCreateTournament} 
                  className="w-full mt-4 bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Vytvořit turnaj s těmito týmy
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenerateTeams;

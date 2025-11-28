import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Shuffle, ArrowRight, PartyPopper } from 'lucide-react';
import { PlayerWithSkill, SkillLevel, GeneratedTeam } from '@/types/player';
import { generateBalancedTeams, getSkillLevelLabel, getSkillLevelColor } from '@/lib/team-generator';
import { toast } from 'sonner';
import marketupLogo from '@/assets/marketup-logo.png';

const GenerateTeams = () => {
  const navigate = useNavigate();
  
  const [players, setPlayers] = useState<PlayerWithSkill[]>([
    { id: crypto.randomUUID(), name: '', skillLevel: 2 },
    { id: crypto.randomUUID(), name: '', skillLevel: 2 },
  ]);
  
  const [generatedTeams, setGeneratedTeams] = useState<GeneratedTeam[]>([]);
  const [teamNamesGenerated, setTeamNamesGenerated] = useState(false);
  const [playersAssignedCount, setPlayersAssignedCount] = useState(0);
  const [balancedTeamsData, setBalancedTeamsData] = useState<GeneratedTeam[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

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

  const handleGenerateTeamNames = async () => {
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
    
    const teams = generateBalancedTeams(validPlayers);
    setBalancedTeamsData(teams);
    
    // Create teams with names only (no players yet)
    const teamsWithNamesOnly = teams.map(team => ({
      ...team,
      player1: { id: '', name: '?', skillLevel: 2 as SkillLevel },
      player2: { id: '', name: '?', skillLevel: 2 as SkillLevel },
    }));
    
    setGeneratedTeams(teamsWithNamesOnly);
    setTeamNamesGenerated(true);
    setPlayersAssignedCount(0);
    toast.success('Názvy týmů vygenerovány!');
  };

  const handleAssignNextPlayer = async () => {
    if (playersAssignedCount >= balancedTeamsData.length) {
      toast.success('Všichni hráči přiřazeni!', { icon: '🎉' });
      return;
    }
    
    setIsAssigning(true);
    
    // Assign one player with animation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setGeneratedTeams(prevTeams => 
      prevTeams.map((team, idx) => 
        idx === playersAssignedCount ? balancedTeamsData[playersAssignedCount] : team
      )
    );
    
    setPlayersAssignedCount(prev => prev + 1);
    setIsAssigning(false);
    
    if (playersAssignedCount + 1 === balancedTeamsData.length) {
      toast.success('Všichni hráči přiřazeni!', { icon: '🎉' });
    }
  };


  const updateTeamName = (teamId: string, name: string) => {
    setGeneratedTeams(generatedTeams.map(t => t.id === teamId ? { ...t, name } : t));
  };

  const handleContinueToSetup = () => {
    if (playersAssignedCount < balancedTeamsData.length) {
      toast.error('Nejdříve přiřaďte všechny hráče');
      return;
    }
    
    const teams = generatedTeams.map(gt => ({
      id: gt.id,
      name: gt.name,
      player1: gt.player1.name,
      player2: gt.player2.name,
    }));
    
    sessionStorage.setItem('generatedTeams', JSON.stringify(teams));
    toast.success('Týmy připraveny k úpravě!');
    navigate('/setup');
  };

  const allPlayersAssigned = playersAssignedCount === balancedTeamsData.length && balancedTeamsData.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-winter via-background to-winter/50 p-6 pt-24 relative overflow-hidden">
      {/* Mountain background with blue filter */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920')] bg-cover bg-center opacity-20" 
           style={{ filter: 'sepia(100%) hue-rotate(190deg) saturate(150%)' }} />
      
      <div className="max-w-6xl mx-auto relative z-10">
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

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {players.map((player, index) => (
                <Card key={player.id} className="p-2">
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Hráč {index + 1}</Label>
                      <Input
                        placeholder="Jméno hráče"
                        value={player.name}
                        onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                        className="h-9"
                      />
                    </div>
                    
                    <div className="w-44 space-y-1">
                      <Label className="text-xs">Úroveň</Label>
                      <Select
                        value={player.skillLevel.toString()}
                        onValueChange={(v) => updatePlayer(player.id, 'skillLevel', parseInt(v) as SkillLevel)}
                      >
                        <SelectTrigger className="h-9">
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
                      className="text-destructive h-9 w-9"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Button 
              onClick={handleGenerateTeamNames} 
              className="w-full mt-4 bg-accent hover:bg-accent/90"
              size="lg"
              disabled={teamNamesGenerated}
            >
              <Shuffle className="w-5 h-5 mr-2" />
              {teamNamesGenerated ? 'Názvy vygenerovány ✓' : 'Vygenerovat vyvážené týmy'}
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
                {!allPlayersAssigned && (
                  <div className="mb-4">
                    <Button 
                      onClick={handleAssignNextPlayer} 
                      className="w-full bg-success hover:bg-success/90 text-success-foreground"
                      size="lg"
                      disabled={isAssigning}
                    >
                      <Shuffle className={`w-6 h-6 mr-2 ${isAssigning ? 'animate-spin' : ''}`} />
                      {isAssigning ? 'Přiřazuji hráče...' : `Přiřadit hráče (${playersAssignedCount}/${balancedTeamsData.length})`}
                    </Button>
                  </div>
                )}

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {generatedTeams.map((team, index) => {
                    const isAnimating = index === playersAssignedCount - 1 && isAssigning;
                    const hasPlayers = team.player1.name !== '?';
                    return (
                      <Card 
                        key={team.id} 
                        className={`p-3 transition-all duration-500 ${
                          isAnimating 
                            ? 'bg-success/20 border-success scale-105 shadow-lg' 
                            : 'bg-card/50'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              value={team.name}
                              onChange={(e) => updateTeamName(team.id, e.target.value)}
                              className="font-semibold flex-1 h-9"
                              disabled={!allPlayersAssigned}
                            />
                            {isAnimating && (
                              <PartyPopper className="w-5 h-5 text-success animate-bounce" />
                            )}
                          </div>
                          
                          {hasPlayers && (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">Hráč 1:</div>
                                <div className="font-medium">{team.player1.name}</div>
                                <span className={`text-xs ${getSkillLevelColor(team.player1.skillLevel)}`}>
                                  {getSkillLevelLabel(team.player1.skillLevel)}
                                </span>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">Hráč 2:</div>
                                <div className="font-medium">{team.player2.name}</div>
                                <span className={`text-xs ${getSkillLevelColor(team.player2.skillLevel)}`}>
                                  {getSkillLevelLabel(team.player2.skillLevel)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {allPlayersAssigned && (
                  <Button 
                    onClick={handleContinueToSetup} 
                    className="w-full mt-4 bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Pokračovat k úpravě týmů
                  </Button>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenerateTeams;

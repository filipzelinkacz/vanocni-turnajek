import { useTournament } from '@/contexts/TournamentContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, Users, Trash2, Eye, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import marketupLogo from '@/assets/marketup-logo.png';
import { toast } from 'sonner';

const History = () => {
  const { historicalTournaments, loadTournament, deleteTournament, clearAllData } = useTournament();
  const navigate = useNavigate();

  const handleView = (tournamentId: string) => {
    loadTournament(tournamentId);
    navigate('/');
  };

  const handleDelete = (tournamentId: string) => {
    deleteTournament(tournamentId);
    toast.success('Turnaj smazán');
  };
  
  const handleClearAll = () => {
    clearAllData();
    toast.success('Všechna data byla vymazána');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-winter via-background to-winter/50 p-6 pt-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src={marketupLogo} alt="Marketup" className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold text-primary">Historické turnaje</h1>
              <p className="text-muted-foreground">Přehled ukončených turnajů</p>
            </div>
          </div>
          
          {historicalTournaments.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="lg">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Vymazat všechna data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Vymazat všechna data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tato akce smaže aktuální turnaj, všechny historické turnaje a veškerá data. Tato akce je nevratná.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Zrušit</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Vymazat vše
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {historicalTournaments.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Žádné historické turnaje</h2>
            <p className="text-muted-foreground mb-6">
              Turnaje se automaticky archivují po vytvoření nového turnaje
            </p>
            <Button onClick={() => navigate('/setup')} className="bg-accent hover:bg-accent/90">
              Vytvořit turnaj
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {historicalTournaments.map((tournament) => {
              const finishedMatches = tournament.matches.filter(m => m.status === 'finished').length;
              const totalMatches = tournament.matches.length;
              
              return (
                <Card key={tournament.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Trophy className="w-6 h-6 text-gold" />
                        <h3 className="text-2xl font-bold">{tournament.name}</h3>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(tournament.date).toLocaleDateString('cs-CZ')}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{tournament.teams.length} týmů</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Trophy className="w-4 h-4" />
                          <span>{finishedMatches}/{totalMatches} zápasů</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                          {tournament.format === 'round-robin' ? 'Každý s každým' : 'Dvě skupiny'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleView(tournament.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Zobrazit
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Smazat turnaj?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Opravdu chcete smazat turnaj "{tournament.name}"? Tato akce je nevratná.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Zrušit</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(tournament.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Smazat
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;

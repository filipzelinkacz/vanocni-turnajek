import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Snowflake } from 'lucide-react';
import { MatchCard } from '@/components/MatchCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Scores = () => {
  const { tournament } = useTournament();

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-secondary">
        <Card className="p-12 text-center">
          <p className="text-xl text-muted-foreground">Nejprve vytvořte turnaj</p>
        </Card>
      </div>
    );
  }

  const scheduledMatches = tournament.matches.filter(m => m.status === 'scheduled');
  const finishedMatches = tournament.matches.filter(m => m.status === 'finished');

  return (
    <div className="min-h-screen bg-gradient-to-br from-winter via-background to-winter/50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Snowflake className="w-10 h-10 text-accent" />
          <div>
            <h1 className="text-4xl font-bold text-primary">Zadávat skóre</h1>
            <p className="text-muted-foreground">{tournament.name}</p>
          </div>
        </div>

        <Tabs defaultValue="scheduled" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scheduled">
              Naplánované ({scheduledMatches.length})
            </TabsTrigger>
            <TabsTrigger value="finished">
              Dokončené ({finishedMatches.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scheduled" className="space-y-4">
            {scheduledMatches.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Žádné naplánované zápasy</p>
              </Card>
            ) : (
              scheduledMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))
            )}
          </TabsContent>

          <TabsContent value="finished" className="space-y-4">
            {finishedMatches.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Žádné dokončené zápasy</p>
              </Card>
            ) : (
              finishedMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Scores;

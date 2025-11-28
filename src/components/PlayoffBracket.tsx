import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, ArrowRight } from 'lucide-react';
import { MatchCard } from './MatchCard';

export const PlayoffBracket = () => {
  const { tournament, advanceToFinals, canAdvanceToFinals } = useTournament();

  if (!tournament || tournament.phase !== 'playoff') return null;

  const semifinalMatches = tournament.matches.filter(m => m.group === 'semifinal');
  const thirdPlaceMatch = tournament.matches.find(m => m.group === 'third-place');
  const finalMatch = tournament.matches.find(m => m.group === 'final');

  const allSemifinalsFinished = semifinalMatches.every(m => m.status === 'finished');
  const finalsReady = finalMatch?.teamAId && finalMatch?.teamBId;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-accent" />
        <h2 className="text-3xl font-bold text-primary">Play-off</h2>
      </div>

      {/* Semifinals */}
      <Card className="p-6 bg-primary/5">
        <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
          <Medal className="w-5 h-5" />
          Semifinále
        </h3>
        <div className="grid gap-6 lg:grid-cols-2">
          {semifinalMatches.map((match, idx) => (
            <div key={match.id}>
              <p className="text-sm text-muted-foreground mb-2 font-medium">
                Semifinále {idx + 1}: {idx === 0 ? '1. místo vs 4. místo' : '2. místo vs 3. místo'}
              </p>
              <MatchCard match={match} />
            </div>
          ))}
        </div>
      </Card>

      {/* Advance to Finals Button */}
      {canAdvanceToFinals && (
        <div className="flex justify-center">
          <Button
            onClick={advanceToFinals}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-lg px-8 py-6"
          >
            <ArrowRight className="w-6 h-6 mr-2" />
            Přistoupit k finále a hře o třetí místo
          </Button>
        </div>
      )}

      {/* Third Place & Final */}
      {finalsReady && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Third Place */}
          {thirdPlaceMatch && thirdPlaceMatch.teamAId && thirdPlaceMatch.teamBId && (
            <Card className="p-6 bg-muted/20">
              <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-600" />
                Zápas o 3. místo
              </h3>
              <MatchCard match={thirdPlaceMatch} />
            </Card>
          )}

          {/* Final */}
          {finalMatch && finalMatch.teamAId && finalMatch.teamBId && (
            <Card className="p-6 bg-accent/10 border-accent/30">
              <h3 className="text-xl font-bold mb-4 text-accent flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                FINÁLE
              </h3>
              <MatchCard match={finalMatch} />
            </Card>
          )}
        </div>
      )}

      {allSemifinalsFinished && !finalsReady && !canAdvanceToFinals && (
        <Card className="p-6 bg-muted/10">
          <p className="text-center text-muted-foreground">
            Stiskněte tlačítko pro přechod k finále
          </p>
        </Card>
      )}

      {!allSemifinalsFinished && (
        <Card className="p-6 bg-muted/10">
          <p className="text-center text-muted-foreground">
            Dokončete semifinálové zápasy
          </p>
        </Card>
      )}
    </div>
  );
};

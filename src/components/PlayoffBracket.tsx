import { useEffect } from 'react';
import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Trophy, Medal } from 'lucide-react';
import { MatchCard } from './MatchCard';

export const PlayoffBracket = () => {
  const { tournament, getTeamById, finishMatch } = useTournament();

  if (!tournament || tournament.phase !== 'playoff') return null;

  const semifinalMatches = tournament.matches.filter(m => m.group === 'semifinal');
  const thirdPlaceMatch = tournament.matches.find(m => m.group === 'third-place');
  const finalMatch = tournament.matches.find(m => m.group === 'final');

  const allSemifinalsFinished = semifinalMatches.every(m => m.status === 'finished');

  // Auto-update third place and final matches when semifinals are finished
  useEffect(() => {
    if (!allSemifinalsFinished || !tournament) return;

    const semi1 = semifinalMatches[0];
    const semi2 = semifinalMatches[1];

    if (!semi1 || !semi2 || !thirdPlaceMatch || !finalMatch) return;

    // Determine winners and losers
    const semi1Winner = semi1.scoreA > semi1.scorB ? semi1.teamAId : semi1.teamBId;
    const semi1Loser = semi1.scoreA > semi1.scorB ? semi1.teamBId : semi1.teamAId;
    const semi2Winner = semi2.scoreA > semi2.scorB ? semi2.teamAId : semi2.teamBId;
    const semi2Loser = semi2.scoreA > semi2.scorB ? semi2.teamBId : semi2.teamAId;

    // Update third place match if not already set
    if (!thirdPlaceMatch.teamAId || !thirdPlaceMatch.teamBId) {
      const updatedMatches = tournament.matches.map(m => {
        if (m.id === thirdPlaceMatch.id) {
          return { ...m, teamAId: semi1Loser, teamBId: semi2Loser };
        }
        if (m.id === finalMatch.id) {
          return { ...m, teamAId: semi1Winner, teamBId: semi2Winner };
        }
        return m;
      });

      // Update tournament with new team assignments
      const updatedTournament = { ...tournament, matches: updatedMatches };
      localStorage.setItem('foosball-tournament', JSON.stringify(updatedTournament));
      window.location.reload(); // Force refresh to show updated bracket
    }
  }, [allSemifinalsFinished, semifinalMatches, thirdPlaceMatch, finalMatch, tournament]);

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

      {/* Third Place & Final */}
      {allSemifinalsFinished && (
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

      {!allSemifinalsFinished && (
        <Card className="p-6 bg-muted/10">
          <p className="text-center text-muted-foreground">
            Dokončete semifinálové zápasy pro zobrazení finále a zápasu o 3. místo
          </p>
        </Card>
      )}
    </div>
  );
};

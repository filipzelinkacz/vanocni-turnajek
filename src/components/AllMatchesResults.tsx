import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Trophy, Target } from 'lucide-react';

export const AllMatchesResults = () => {
  const { tournament, getTeamById } = useTournament();

  if (!tournament) return null;

  const groupMatches = tournament.matches.filter(m => 
    m.status === 'finished' && (!m.group || m.group === 'A' || m.group === 'B')
  );

  const playoffMatches = tournament.matches.filter(m => 
    m.status === 'finished' && (m.group === 'semifinal' || m.group === 'third-place' || m.group === 'final')
  );

  const groupAMatches = groupMatches.filter(m => m.group === 'A');
  const groupBMatches = groupMatches.filter(m => m.group === 'B');
  const roundRobinMatches = groupMatches.filter(m => !m.group);

  const semifinalMatches = playoffMatches.filter(m => m.group === 'semifinal');
  const thirdPlaceMatch = playoffMatches.find(m => m.group === 'third-place');
  const finalMatch = playoffMatches.find(m => m.group === 'final');

  const MatchItem = ({ match }: { match: any }) => {
    const teamA = getTeamById(match.teamAId);
    const teamB = getTeamById(match.teamBId);
    
    return (
      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
        <div className="flex-1 text-right">
          <span className={`font-medium ${match.scoreA > match.scorB ? 'text-accent font-bold' : 'text-primary'}`}>
            {teamA?.name}
          </span>
        </div>
        <div className="px-4 text-center">
          <span className="text-xl font-bold text-accent">
            {match.scoreA} : {match.scorB}
          </span>
        </div>
        <div className="flex-1">
          <span className={`font-medium ${match.scorB > match.scoreA ? 'text-accent font-bold' : 'text-primary'}`}>
            {teamB?.name}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
        <Target className="w-6 h-6" />
        Všechny výsledky zápasů
      </h2>

      {/* Group Stage */}
      {tournament.format === 'two-groups' ? (
        <div className="grid gap-6 md:grid-cols-2">
          {groupAMatches.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-primary mb-4">Skupina A</h3>
              <div className="space-y-2">
                {groupAMatches.map(match => (
                  <MatchItem key={match.id} match={match} />
                ))}
              </div>
            </Card>
          )}
          
          {groupBMatches.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-primary mb-4">Skupina B</h3>
              <div className="space-y-2">
                {groupBMatches.map(match => (
                  <MatchItem key={match.id} match={match} />
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : (
        roundRobinMatches.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-primary mb-4">Základní část - Každý s každým</h3>
            <div className="space-y-2">
              {roundRobinMatches.map(match => (
                <MatchItem key={match.id} match={match} />
              ))}
            </div>
          </Card>
        )
      )}

      {/* Playoff */}
      {playoffMatches.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20">
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-accent" />
            Play-off
          </h3>
          
          <div className="space-y-6">
            {semifinalMatches.length > 0 && (
              <div>
                <h4 className="text-md font-bold text-accent mb-3">Semifinále</h4>
                <div className="space-y-2">
                  {semifinalMatches.map(match => (
                    <MatchItem key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {thirdPlaceMatch && (
                <div>
                  <h4 className="text-md font-bold text-amber-600 mb-3">O 3. místo</h4>
                  <MatchItem match={thirdPlaceMatch} />
                </div>
              )}

              {finalMatch && (
                <div>
                  <h4 className="text-md font-bold text-yellow-500 mb-3">Finále</h4>
                  <MatchItem match={finalMatch} />
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

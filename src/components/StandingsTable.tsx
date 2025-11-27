import { useTournament } from '@/contexts/TournamentContext';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const StandingsTable = () => {
  const { standings, getTeamById } = useTournament();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="w-6 h-6 text-gold" />
        <h2 className="text-2xl font-bold text-primary">Průběžná tabulka</h2>
      </div>

      <TooltipProvider>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Tým</TableHead>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableHead className="text-center cursor-help">Z</TableHead>
                </TooltipTrigger>
                <TooltipContent>Zápasy odehrané</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableHead className="text-center cursor-help">V</TableHead>
                </TooltipTrigger>
                <TooltipContent>Výhry</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableHead className="text-center cursor-help">P</TableHead>
                </TooltipTrigger>
                <TooltipContent>Prohry</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableHead className="text-center cursor-help">GS</TableHead>
                </TooltipTrigger>
                <TooltipContent>Góly vstřelené</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableHead className="text-center cursor-help">GA</TableHead>
                </TooltipTrigger>
                <TooltipContent>Góly obdržené</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableHead className="text-center cursor-help">GD</TableHead>
                </TooltipTrigger>
                <TooltipContent>Rozdíl skóre</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableHead className="text-center font-bold cursor-help">Body</TableHead>
                </TooltipTrigger>
                <TooltipContent>Body (1 za výhru)</TooltipContent>
              </Tooltip>
            </TableRow>
          </TableHeader>
        <TableBody>
          {standings.map((stat, index) => {
            const team = getTeamById(stat.teamId);
            if (!team) return null;

            const isWinner = index === 0 && stat.points > 0;

            return (
              <TableRow
                key={stat.teamId}
                className={isWinner ? 'bg-gold/10 border-gold' : ''}
              >
                <TableCell className="font-medium">
                  {isWinner ? '🏆' : index + 1}
                </TableCell>
                <TableCell className="font-semibold">
                  <div>
                    <div className="text-base">{team.name}</div>
                    {(team.player1 || team.player2) && (
                      <div className="text-xs text-muted-foreground">
                        {[team.player1, team.player2].filter(Boolean).join(' & ')}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">{stat.played}</TableCell>
                <TableCell className="text-center">{stat.won}</TableCell>
                <TableCell className="text-center">{stat.lost}</TableCell>
                <TableCell className="text-center">{stat.goalsFor}</TableCell>
                <TableCell className="text-center">{stat.goalsAgainst}</TableCell>
                <TableCell className="text-center font-medium">
                  {stat.goalDifference > 0 ? '+' : ''}{stat.goalDifference}
                </TableCell>
                <TableCell className="text-center font-bold text-lg">
                  {stat.points}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        </Table>
      </TooltipProvider>

      {standings.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Zatím nejsou žádné výsledky
        </p>
      )}
    </Card>
  );
};

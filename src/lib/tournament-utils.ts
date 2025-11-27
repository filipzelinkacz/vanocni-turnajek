import { Team, Match, TournamentFormat, TeamStats } from '@/types/tournament';

export function generateMatches(teams: Team[], format: TournamentFormat): Match[] {
  if (format === 'round-robin') {
    return generateRoundRobinMatches(teams);
  } else {
    return generateTwoGroupMatches(teams);
  }
}

function generateRoundRobinMatches(teams: Team[]): Match[] {
  const matches: Match[] = [];
  let order = 0;

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        id: crypto.randomUUID(),
        teamAId: teams[i].id,
        teamBId: teams[j].id,
        scoreA: 0,
        scorB: 0,
        status: 'scheduled',
        order: order++,
      });
    }
  }

  return matches;
}

function generateTwoGroupMatches(teams: Team[]): Match[] {
  const matches: Match[] = [];
  let order = 0;

  const midpoint = Math.ceil(teams.length / 2);
  const groupA = teams.slice(0, midpoint);
  const groupB = teams.slice(midpoint);

  // Group A matches
  for (let i = 0; i < groupA.length; i++) {
    for (let j = i + 1; j < groupA.length; j++) {
      matches.push({
        id: crypto.randomUUID(),
        teamAId: groupA[i].id,
        teamBId: groupA[j].id,
        scoreA: 0,
        scorB: 0,
        status: 'scheduled',
        group: 'A',
        order: order++,
      });
    }
  }

  // Group B matches
  for (let i = 0; i < groupB.length; i++) {
    for (let j = i + 1; j < groupB.length; j++) {
      matches.push({
        id: crypto.randomUUID(),
        teamAId: groupB[i].id,
        teamBId: groupB[j].id,
        scoreA: 0,
        scorB: 0,
        status: 'scheduled',
        group: 'B',
        order: order++,
      });
    }
  }

  return matches;
}

export function calculateStandings(teams: Team[], matches: Match[]): TeamStats[] {
  const stats: Record<string, TeamStats> = {};

  // Initialize stats
  teams.forEach(team => {
    stats[team.id] = {
      teamId: team.id,
      played: 0,
      won: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  });

  // Calculate from finished matches
  matches
    .filter(m => m.status === 'finished')
    .forEach(match => {
      const teamA = stats[match.teamAId];
      const teamB = stats[match.teamBId];

      if (!teamA || !teamB) return;

      teamA.played++;
      teamB.played++;

      teamA.goalsFor += match.scoreA;
      teamA.goalsAgainst += match.scorB;
      teamB.goalsFor += match.scorB;
      teamB.goalsAgainst += match.scoreA;

      if (match.scoreA > match.scorB) {
        teamA.won++;
        teamA.points += 1;
        teamB.lost++;
      } else if (match.scorB > match.scoreA) {
        teamB.won++;
        teamB.points += 1;
        teamA.lost++;
      }
    });

  // Calculate goal difference
  Object.values(stats).forEach(stat => {
    stat.goalDifference = stat.goalsFor - stat.goalsAgainst;
  });

  // Sort standings
  return Object.values(stats).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return 0;
  });
}

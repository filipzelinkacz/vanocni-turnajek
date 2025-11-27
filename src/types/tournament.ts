export type TournamentFormat = 'round-robin' | 'two-groups';

export type MatchStatus = 'scheduled' | 'finished';

export interface Player {
  name: string;
}

export interface Team {
  id: string;
  name: string;
  player1?: string;
  player2?: string;
}

export interface Match {
  id: string;
  teamAId: string;
  teamBId: string;
  scoreA: number;
  scorB: number;
  status: MatchStatus;
  group?: 'A' | 'B' | 'semifinal' | 'final' | 'third-place';
  order: number;
}

export interface TeamStats {
  teamId: string;
  played: number;
  won: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Tournament {
  id: string;
  name: string;
  format: TournamentFormat;
  date: string;
  teams: Team[];
  matches: Match[];
  createdAt: string;
}

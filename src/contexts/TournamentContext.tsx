import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tournament, Team, Match, TournamentFormat, TeamStats } from '@/types/tournament';
import { generateMatches, calculateStandings } from '@/lib/tournament-utils';

export interface Prediction {
  playerName: string;
  predictedTeamId: string;
  timestamp: string;
}

interface TournamentContextType {
  tournament: Tournament | null;
  historicalTournaments: Tournament[];
  createTournament: (name: string, format: TournamentFormat, teams: Team[]) => void;
  updateMatchScore: (matchId: string, scoreA: number, scoreB: number) => void;
  finishMatch: (matchId: string) => void;
  getTeamById: (teamId: string) => Team | undefined;
  standings: TeamStats[];
  previousStandings: TeamStats[];
  recentMatches: Match[];
  upcomingMatches: Match[];
  archiveTournament: () => void;
  loadTournament: (tournamentId: string) => void;
  deleteTournament: (tournamentId: string) => void;
  clearAllData: () => void;
  endTournamentEarly: () => void;
  startPlayoff: () => void;
  canStartPlayoff: boolean;
  advanceToFinals: () => void;
  canAdvanceToFinals: boolean;
  isTournamentFinished: boolean;
  predictions: Prediction[];
  addPrediction: (playerName: string, predictedTeamId: string) => void;
  canMakePredictions: boolean;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

const STORAGE_KEY = 'foosball-tournament';
const HISTORY_KEY = 'foosball-tournament-history';
const STANDINGS_KEY = 'foosball-previous-standings';
const PREDICTIONS_KEY = 'foosball-predictions';

export const TournamentProvider = ({ children }: { children: ReactNode }) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [historicalTournaments, setHistoricalTournaments] = useState<Tournament[]>([]);
  const [previousStandings, setPreviousStandings] = useState<TeamStats[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTournament(JSON.parse(stored));
    }
    
    const history = localStorage.getItem(HISTORY_KEY);
    if (history) {
      setHistoricalTournaments(JSON.parse(history));
    }
    
    const prevStandings = localStorage.getItem(STANDINGS_KEY);
    if (prevStandings) {
      setPreviousStandings(JSON.parse(prevStandings));
    }

    const storedPredictions = localStorage.getItem(PREDICTIONS_KEY);
    if (storedPredictions) {
      setPredictions(JSON.parse(storedPredictions));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (tournament) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tournament));
    }
  }, [tournament]);
  
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historicalTournaments));
  }, [historicalTournaments]);

  useEffect(() => {
    localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictions));
  }, [predictions]);

  const createTournament = (name: string, format: TournamentFormat, teams: Team[]) => {
    const matches = generateMatches(teams, format);
    const newTournament: Tournament = {
      id: crypto.randomUUID(),
      name,
      format,
      date: new Date().toISOString(),
      teams,
      matches,
      createdAt: new Date().toISOString(),
      phase: 'group',
    };
    setTournament(newTournament);
  };

  const updateMatchScore = (matchId: string, scoreA: number, scoreB: number) => {
    setTournament(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        matches: prev.matches.map(match =>
          match.id === matchId
            ? { ...match, scoreA, scorB: scoreB }
            : match
        ),
      };
    });
  };

  const finishMatch = (matchId: string) => {
    if (!tournament) return;

    // Save current standings before finishing match
    const currentStandings = calculateStandings(tournament.teams, tournament.matches);
    setPreviousStandings(currentStandings);
    localStorage.setItem(STANDINGS_KEY, JSON.stringify(currentStandings));

    setTournament(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        matches: prev.matches.map(match =>
          match.id === matchId
            ? { ...match, status: 'finished' as const }
            : match
        ),
      };
    });
  };

  const getTeamById = (teamId: string) => {
    return tournament?.teams.find(t => t.id === teamId);
  };

  const standings = tournament ? calculateStandings(tournament.teams, tournament.matches) : [];
  
  const recentMatches = tournament 
    ? tournament.matches
        .filter(m => m.status === 'finished')
        .sort((a, b) => b.order - a.order)
        .slice(0, 5)
    : [];

  const upcomingMatches = tournament
    ? tournament.matches
        .filter(m => m.status === 'scheduled')
        .sort((a, b) => a.order - b.order)
    : [];

  const archiveTournament = () => {
    if (!tournament) return;
    
    const archivedTournament = {
      ...tournament,
      archivedAt: new Date().toISOString(),
    };
    
    setHistoricalTournaments([archivedTournament, ...historicalTournaments]);
    setTournament(null);
    localStorage.removeItem(STORAGE_KEY);
  };
  
  const loadTournament = (tournamentId: string) => {
    const tournamentToLoad = historicalTournaments.find(t => t.id === tournamentId);
    if (tournamentToLoad) {
      setTournament(tournamentToLoad);
    }
  };
  
  const deleteTournament = (tournamentId: string) => {
    setHistoricalTournaments(historicalTournaments.filter(t => t.id !== tournamentId));
  };
  
  const clearAllData = () => {
    setTournament(null);
    setHistoricalTournaments([]);
    setPreviousStandings([]);
    setPredictions([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(STANDINGS_KEY);
    localStorage.removeItem(PREDICTIONS_KEY);
  };

  const addPrediction = (playerName: string, predictedTeamId: string) => {
    const newPrediction: Prediction = {
      playerName,
      predictedTeamId,
      timestamp: new Date().toISOString(),
    };
    setPredictions([...predictions, newPrediction]);
  };

  const canMakePredictions = tournament 
    ? tournament.matches.every(m => m.status === 'scheduled')
    : false;
  
  const endTournamentEarly = () => {
    if (!tournament) return;
    archiveTournament();
  };

  const canStartPlayoff = tournament 
    ? tournament.phase === 'group' && 
      tournament.matches.filter(m => !m.group || m.group === 'A' || m.group === 'B').every(m => m.status === 'finished')
    : false;

  const canAdvanceToFinals = tournament
    ? tournament.phase === 'playoff' &&
      tournament.matches.filter(m => m.group === 'semifinal').every(m => m.status === 'finished') &&
      tournament.matches.find(m => m.group === 'final')?.teamAId === ''
    : false;

  const isTournamentFinished = tournament
    ? tournament.phase === 'playoff' &&
      tournament.matches.find(m => m.group === 'final')?.status === 'finished' &&
      tournament.matches.find(m => m.group === 'third-place')?.status === 'finished'
    : false;

  const startPlayoff = () => {
    if (!tournament || !canStartPlayoff) return;

    const finalStandings = calculateStandings(tournament.teams, tournament.matches);
    
    // Top 4 teams for playoff
    const top4 = finalStandings.slice(0, 4);
    
    if (top4.length < 4) return;

    const playoffMatches: Match[] = [
      // Semifinále 1: 1. vs 4.
      {
        id: crypto.randomUUID(),
        teamAId: top4[0].teamId,
        teamBId: top4[3].teamId,
        scoreA: 0,
        scorB: 0,
        status: 'scheduled',
        group: 'semifinal',
        order: tournament.matches.length + 1,
      },
      // Semifinále 2: 2. vs 3.
      {
        id: crypto.randomUUID(),
        teamAId: top4[1].teamId,
        teamBId: top4[2].teamId,
        scoreA: 0,
        scorB: 0,
        status: 'scheduled',
        group: 'semifinal',
        order: tournament.matches.length + 2,
      },
      // Zápas o 3. místo (TBD)
      {
        id: crypto.randomUUID(),
        teamAId: '', // Will be filled after semifinals
        teamBId: '',
        scoreA: 0,
        scorB: 0,
        status: 'scheduled',
        group: 'third-place',
        order: tournament.matches.length + 3,
      },
      // Finále (TBD)
      {
        id: crypto.randomUUID(),
        teamAId: '', // Will be filled after semifinals
        teamBId: '',
        scoreA: 0,
        scorB: 0,
        status: 'scheduled',
        group: 'final',
        order: tournament.matches.length + 4,
      },
    ];

    setTournament({
      ...tournament,
      phase: 'playoff',
      matches: [...tournament.matches, ...playoffMatches],
    });
  };

  const advanceToFinals = () => {
    if (!tournament || !canAdvanceToFinals) return;

    const semifinalMatches = tournament.matches.filter(m => m.group === 'semifinal');
    const semi1 = semifinalMatches[0];
    const semi2 = semifinalMatches[1];

    if (!semi1 || !semi2) return;

    // Determine winners and losers
    const semi1Winner = semi1.scoreA > semi1.scorB ? semi1.teamAId : semi1.teamBId;
    const semi1Loser = semi1.scoreA > semi1.scorB ? semi1.teamBId : semi1.teamAId;
    const semi2Winner = semi2.scoreA > semi2.scorB ? semi2.teamAId : semi2.teamBId;
    const semi2Loser = semi2.scoreA > semi2.scorB ? semi2.teamBId : semi2.teamAId;

    setTournament(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        matches: prev.matches.map(m => {
          if (m.group === 'third-place') {
            return { ...m, teamAId: semi1Loser, teamBId: semi2Loser };
          }
          if (m.group === 'final') {
            return { ...m, teamAId: semi1Winner, teamBId: semi2Winner };
          }
          return m;
        }),
      };
    });
  };

  return (
    <TournamentContext.Provider
      value={{
        tournament,
        historicalTournaments,
        createTournament,
        updateMatchScore,
        finishMatch,
        getTeamById,
        standings,
        previousStandings,
        recentMatches,
        upcomingMatches,
        archiveTournament,
        loadTournament,
        deleteTournament,
        clearAllData,
        endTournamentEarly,
        startPlayoff,
        canStartPlayoff,
        advanceToFinals,
        canAdvanceToFinals,
        isTournamentFinished,
        predictions,
        addPrediction,
        canMakePredictions,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within TournamentProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tournament, Team, Match, TournamentFormat, TeamStats } from '@/types/tournament';
import { generateMatches, calculateStandings } from '@/lib/tournament-utils';

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
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

const STORAGE_KEY = 'foosball-tournament';
const HISTORY_KEY = 'foosball-tournament-history';
const STANDINGS_KEY = 'foosball-previous-standings';

export const TournamentProvider = ({ children }: { children: ReactNode }) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [historicalTournaments, setHistoricalTournaments] = useState<Tournament[]>([]);
  const [previousStandings, setPreviousStandings] = useState<TeamStats[]>([]);

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
    };
    setTournament(newTournament);
  };

  const updateMatchScore = (matchId: string, scoreA: number, scoreB: number) => {
    if (!tournament) return;
    
    setTournament({
      ...tournament,
      matches: tournament.matches.map(match =>
        match.id === matchId
          ? { ...match, scoreA, scorB: scoreB }
          : match
      ),
    });
  };

  const finishMatch = (matchId: string) => {
    if (!tournament) return;
    
    // Save current standings before finishing match
    const currentStandings = calculateStandings(tournament.teams, tournament.matches);
    setPreviousStandings(currentStandings);
    localStorage.setItem(STANDINGS_KEY, JSON.stringify(currentStandings));
    
    setTournament({
      ...tournament,
      matches: tournament.matches.map(match =>
        match.id === matchId
          ? { ...match, status: 'finished' as const }
          : match
      ),
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
        .slice(0, 3)
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
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(STANDINGS_KEY);
  };
  
  const endTournamentEarly = () => {
    if (!tournament) return;
    archiveTournament();
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

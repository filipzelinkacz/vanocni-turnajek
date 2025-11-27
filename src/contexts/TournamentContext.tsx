import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tournament, Team, Match, TournamentFormat, TeamStats } from '@/types/tournament';
import { generateMatches, calculateStandings } from '@/lib/tournament-utils';

interface TournamentContextType {
  tournament: Tournament | null;
  createTournament: (name: string, format: TournamentFormat, teams: Team[]) => void;
  updateMatchScore: (matchId: string, scoreA: number, scoreB: number) => void;
  finishMatch: (matchId: string) => void;
  getTeamById: (teamId: string) => Team | undefined;
  standings: TeamStats[];
  recentMatches: Match[];
  upcomingMatches: Match[];
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

const STORAGE_KEY = 'foosball-tournament';

export const TournamentProvider = ({ children }: { children: ReactNode }) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTournament(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (tournament) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tournament));
    }
  }, [tournament]);

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

  return (
    <TournamentContext.Provider
      value={{
        tournament,
        createTournament,
        updateMatchScore,
        finishMatch,
        getTeamById,
        standings,
        recentMatches,
        upcomingMatches,
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

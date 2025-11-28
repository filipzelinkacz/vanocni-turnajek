import { PlayerWithSkill, GeneratedTeam, SkillLevel } from '@/types/player';

// Marketing buzzwords for fun team names
const marketingWords = [
  'Digitální', 'Kreativní', 'Strategičtí', 'Inovativní', 'Dynamičtí', 'Virální', 
  'Organičtí', 'Zapojení', 'Interaktivní', 'Responzivní', 'Optimalizovaní', 'Synergičtí',
  'Disruptivní', 'Agilní', 'Výkonnostní', 'Konverzní', 'ROI', 'Růstoví',
  'Brandoví', 'Contentoví', 'Sociální', 'Analytičtí', 'Influenceři', 'Kampaňoví'
];

const christmasWords = [
  'Skřítkové', 'Vločky', 'Sobíci', 'Dárečci', 'Cukroví', 'Jmelí',
  'Andělé', 'Hvězdy', 'Zvonečky', 'Světýlka', 'Koledy', 'Duchové',
  'Saně', 'Perníčci', 'Řetězy', 'Věnečky', 'Radost', 'Pohoda'
];

const generateTeamName = (index: number): string => {
  const marketing = marketingWords[Math.floor(Math.random() * marketingWords.length)];
  const christmas = christmasWords[Math.floor(Math.random() * christmasWords.length)];
  return `${marketing} ${christmas}`;
};

// Function to generate balanced teams from a list of players
export const generateBalancedTeams = (players: PlayerWithSkill[]): GeneratedTeam[] => {
  if (players.length % 2 !== 0) {
    throw new Error('Počet hráčů musí být sudý');
  }

  // Sort players by skill level (best to worst)
  const sortedPlayers = [...players].sort((a, b) => a.skillLevel - b.skillLevel);
  
  // Split into two halves
  const better = sortedPlayers.slice(0, Math.floor(sortedPlayers.length / 2));
  const worse = sortedPlayers.slice(Math.floor(sortedPlayers.length / 2));
  
  // Reverse the worse half so we pair best with worst
  worse.reverse();
  
  // Create teams by pairing
  const teams: GeneratedTeam[] = [];
  
  for (let i = 0; i < better.length; i++) {
    const player1 = better[i];
    const player2 = worse[i];
    
    teams.push({
      id: crypto.randomUUID(),
      name: generateTeamName(i),
      player1,
      player2,
      averageSkill: (player1.skillLevel + player2.skillLevel) / 2,
    });
  }
  
  // Sort teams by average skill for display
  return teams.sort((a, b) => a.averageSkill - b.averageSkill);
};

export const getSkillLevelLabel = (level: SkillLevel): string => {
  switch (level) {
    case 1:
      return 'Dobrý';
    case 2:
      return 'Průměr';
    case 3:
      return 'Prostor pro zlepšení';
  }
};

export const getSkillLevelColor = (level: SkillLevel): string => {
  switch (level) {
    case 1:
      return 'text-success';
    case 2:
      return 'text-primary';
    case 3:
      return 'text-accent';
  }
};

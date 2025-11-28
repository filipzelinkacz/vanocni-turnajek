export type SkillLevel = 1 | 2 | 3;

export interface PlayerWithSkill {
  id: string;
  name: string;
  skillLevel: SkillLevel;
}

export interface GeneratedTeam {
  id: string;
  name: string;
  player1: PlayerWithSkill;
  player2: PlayerWithSkill;
  averageSkill: number;
}

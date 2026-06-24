export interface Player {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  playerIds: string[];
}

export interface Word {
  id: string;
  text: string;
  isCustom: boolean;
}

export interface RoundWord {
  wordId: string;
  text: string;
  guessed: boolean;
}

export interface RoundResult {
  teamId: string;
  words: RoundWord[];
  score: number;
}

export interface GameSettings {
  wordsPerPlayer: number;
  roundTime: number;
  allowSkip: boolean;
  teams: Team[];
  players: Player[];
}

export interface GameState {
  currentRound: number;
  currentTeamIndex: number;
  teamOrder: string[];
  results: RoundResult[];
  usedWordIds: string[];
  isGameOver: boolean;
}

export type Page = 'start' | 'settings' | 'hall' | 'play' | 'results' | 'end' | 'words';
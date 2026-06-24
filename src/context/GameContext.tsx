/* eslint-disable react-hooks/refs */
import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { Page, GameSettings, GameState, Team, Word, RoundWord } from '../types';
import { defaultWords } from '../data/defaultWords';
import * as storage from '../utils/storage';

interface GameContextType {
  page: Page;
  setPage: (page: Page) => void;
  words: Word[];
  addWord: (text: string) => void;
  removeWord: (id: string) => void;
  resetWords: () => void;
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;
  gameState: GameState;
  startGame: () => void;
  startRound: () => void;
  endRound: (roundWords: RoundWord[]) => void;
  nextRound: () => void;
  resetGame: () => void;
  getCurrentTeam: () => Team | undefined;
  getTeamScore: (teamId: string) => number;
  getShuffledWords: (count: number) => Word[];
}

const defaultSettings: GameSettings = {
  wordsPerPlayer: 5,
  roundTime: 60,
  allowSkip: true,
  teams: [
    { id: 't1', name: 'Команда 1', playerIds: [] },
    { id: 't2', name: 'Команда 2', playerIds: [] },
  ],
  players: [],
};

const defaultGameState: GameState = {
  currentRound: 0,
  currentTeamIndex: 0,
  teamOrder: [],
  results: [],
  usedWordIds: [],
  isGameOver: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>('start');

  const [words, setWords] = useState<Word[]>(() => {
    const saved = storage.getWords();
    if (saved.length > 0) return saved;
    storage.saveWords(defaultWords);
    return defaultWords;
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = storage.getSettings();
    return saved || defaultSettings;
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = storage.getGameState();
    return saved || defaultGameState;
  });

  // Ref для отслеживания isGameOver без useEffect
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const pageRef = useRef(page);
  pageRef.current = page;

  useEffect(() => { storage.saveWords(words); }, [words]);
  useEffect(() => { storage.saveSettings(settings); }, [settings]);
  useEffect(() => { storage.saveGameState(gameState); }, [gameState]);

  const addWord = useCallback((text: string) => {
    const newWord = storage.addWord(text);
    setWords(prev => [...prev, newWord]);
  }, []);

  const removeWord = useCallback((id: string) => {
    storage.removeWord(id);
    setWords(prev => prev.filter(w => w.id !== id));
  }, []);

  const resetWords = useCallback(() => {
    storage.resetToDefaultWords(defaultWords);
    setWords(defaultWords);
  }, []);

  const updateSettings = useCallback((partial: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const startGame = useCallback(() => {
    const teamOrder = settings.teams.map(t => t.id);
    const shuffled = [...teamOrder].sort(() => Math.random() - 0.5);

    const newState: GameState = {
      currentRound: 1,
      currentTeamIndex: 0,
      teamOrder: shuffled,
      results: [],
      usedWordIds: [],
      isGameOver: false,
    };

    setGameState(newState);
    setPage('hall');
  }, [settings.teams]);

  const startRound = useCallback(() => {
    setPage('play');
  }, []);

  const endRound = useCallback((roundWords: RoundWord[]) => {
    const currentTeamId = gameStateRef.current.teamOrder[gameStateRef.current.currentTeamIndex];
    const score = roundWords.filter(w => w.guessed).length;

    const newResult = {
      teamId: currentTeamId,
      words: roundWords,
      score,
    };

    const usedIds = roundWords.map(w => w.wordId);

    setGameState(prev => ({
      ...prev,
      results: [...prev.results, newResult],
      usedWordIds: [...prev.usedWordIds, ...usedIds],
    }));

    setPage('results');
  }, []);

  const nextRound = useCallback(() => {
    setGameState(prev => {
      const nextIndex = prev.currentTeamIndex + 1;

      if (nextIndex >= prev.teamOrder.length) {
        const nextRoundNum = prev.currentRound + 1;
        const totalWordsNeeded = settings.teams.length * settings.wordsPerPlayer;
        const availableWords = words.length - prev.usedWordIds.length;

        if (availableWords < totalWordsNeeded || nextRoundNum > 3) {
          // Игра закончена — перенаправляем на End
          setTimeout(() => setPage('end'), 0);
          return { ...prev, isGameOver: true };
        }

        return {
          ...prev,
          currentRound: nextRoundNum,
          currentTeamIndex: 0,
          teamOrder: [...prev.teamOrder].sort(() => Math.random() - 0.5),
        };
      }

      return { ...prev, currentTeamIndex: nextIndex };
    });

    setPage('hall');
  }, [settings.teams.length, settings.wordsPerPlayer, words.length]);

  const resetGame = useCallback(() => {
    storage.clearGameState();
    setGameState(defaultGameState);
    setPage('start');
  }, []);

  const getCurrentTeam = useCallback(() => {
    const teamId = gameStateRef.current.teamOrder[gameStateRef.current.currentTeamIndex];
    return settings.teams.find(t => t.id === teamId);
  }, [settings.teams]);

  const getTeamScore = useCallback((teamId: string) => {
    return gameStateRef.current.results
      .filter(r => r.teamId === teamId)
      .reduce((sum, r) => sum + r.score, 0);
  }, []);

  const getShuffledWords = useCallback((count: number) => {
    const available = words.filter(w => !gameStateRef.current.usedWordIds.includes(w.id));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }, [words]);

  return (
    <GameContext.Provider value={{
      page, setPage,
      words, addWord, removeWord, resetWords,
      settings, updateSettings,
      gameState, startGame, startRound, endRound, nextRound, resetGame,
      getCurrentTeam, getTeamScore, getShuffledWords,
    }}>
      {children}
    </GameContext.Provider>
  );
}

// Хук в отдельном файле рекомендуется, но пока оставим тут
// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
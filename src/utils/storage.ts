import type { Word, GameSettings, GameState } from '../types';

const WORDS_KEY = 'alias_words';
const SETTINGS_KEY = 'alias_settings';
const GAME_STATE_KEY = 'alias_game_state';

// === СЛОВА ===
export const getWords = (): Word[] => {
  const data = localStorage.getItem(WORDS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveWords = (words: Word[]) => {
  localStorage.setItem(WORDS_KEY, JSON.stringify(words));
};

export const addWord = (text: string): Word => {
  const words = getWords();
  const newWord: Word = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    text: text.trim(),
    isCustom: true,
  };
  saveWords([...words, newWord]);
  return newWord;
};

export const removeWord = (id: string) => {
  const words = getWords().filter(w => w.id !== id);
  saveWords(words);
};

export const resetToDefaultWords = (defaultWords: Word[]) => {
  saveWords(defaultWords);
};

// === НАСТРОЙКИ ===
export const getSettings = (): GameSettings | null => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveSettings = (settings: GameSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// === СОСТОЯНИЕ ИГРЫ ===
export const getGameState = (): GameState | null => {
  const data = localStorage.getItem(GAME_STATE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveGameState = (state: GameState) => {
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
};

export const clearGameState = () => {
  localStorage.removeItem(GAME_STATE_KEY);
};
import { signal } from '@lit-labs/signals';

export const defaultGuesses = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
} as Record<number, string[]>;

export type gameScore = {
  [key: string]: boolean | number;
  won: boolean;
  timestamp: number;
  guessCount: number;
}

// Global store
export const gameState = signal({
  currentGuess: 0,
  guesses: defaultGuesses,
  gameWord: '',
  gameWon: false,
  gameOver: false,
  notWord: null as null | number,
  scores: [] as gameScore[],
});

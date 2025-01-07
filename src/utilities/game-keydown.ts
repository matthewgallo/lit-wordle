import wordExists from 'word-exists';
import { gameState } from '../game-board';

const isAlphabetic = (key: string) => {
  return /^[a-zA-Z]$/.test(key);
}

export const gameKeydown = (event?: KeyboardEvent, key?: string) => {
  if (!gameState.get().gameWord.length) {
    return;
  }
  const pressedKey = key ?? event?.key ?? '';
  const guessNumber = gameState.get().currentGuess;
  const gameWord = gameState.get().gameWord;
  const prevCurrentGuess = gameState.get().guesses[guessNumber];
  if (prevCurrentGuess.length > 0 && pressedKey === 'Backspace') {
    prevCurrentGuess.pop();
    const newGuesses = {...gameState.get().guesses};
    newGuesses[guessNumber] = [...prevCurrentGuess];
    gameState.set({
      ...gameState.get(),
      guesses: newGuesses,
    });
  }
  if (prevCurrentGuess.length === 5 && pressedKey === 'Enter') {
    (document.activeElement as HTMLElement).blur();
    // Entered word, is not a valid word
    if (!wordExists(prevCurrentGuess.join(''))) {
      gameState.set({
        ...gameState.get(),
        notWord: gameState.get().currentGuess,
      });
      // Refactor later, just removes class after css animation
      // Maybe use ontransitionend, rather than a setTimeout
      setTimeout(() => {
        const rootElement = document.querySelector('game-board');
        if (rootElement?.shadowRoot) {
          const wrongWordRow = rootElement.shadowRoot.querySelector('.not-a-word');
          wrongWordRow?.classList.remove('not-a-word');
          gameState.set({
            ...gameState.get(),
            notWord: null,
          });
        }
      }, 510);
      return;
    }

    // Player has won if guess equals the chosen game word
    if (prevCurrentGuess.join('') === gameWord) {
      gameState.set({
        ...gameState.get(),
        gameWon: true,
        gameOver: true,
        scores: [
          ...gameState.get().scores,
          {
            won: true,
            timestamp: Date.now(),
            guessCount: gameState.get().currentGuess + 1
          }
        ]
      });
      return;
    }
    if (guessNumber === 5) {
      // Game over, last guess
      return gameState.set({
        ...gameState.get(),
        gameOver: true,
        gameWon: false,
        scores: [
          ...gameState.get().scores,
          {
            won: false,
            timestamp: Date.now(),
            guessCount: gameState.get().currentGuess + 1
          }
        ]
      });
    }
    gameState.set({
      ...gameState.get(),
      currentGuess: gameState.get().currentGuess + 1,
    });
  }
  if (!isAlphabetic(pressedKey) || prevCurrentGuess.length === 5) return;
  
  const newGuesses = {...gameState.get().guesses};
  newGuesses[guessNumber] = [...prevCurrentGuess, pressedKey]
  gameState.set({
    ...gameState.get(),
    guesses: newGuesses
  });
}
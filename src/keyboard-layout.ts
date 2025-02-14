import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js'
import { SignalWatcher } from '@lit-labs/signals';
import { gameState } from './game-state';

const checkIsCorrect = (l: string, guessedLetters: string[][], gameWord: string) => {
  let isCorrect = false;
  guessedLetters.map((set: string[]) => {
    set.map((letter: string, letterIndex) => {
      if (
        gameWord.charAt(letterIndex) === letter &&
        gameWord.charAt(letterIndex) === l
        ) {
        isCorrect = true;
      }
    });
  })
  return isCorrect;
}

const checkNotInPuzzle = (l: string, guessedLetters: string[][], gameWord: string) => {
  const flatGuesses = guessedLetters.flat();
  if (flatGuesses.includes(l) && !gameWord.includes(l)) {
    return true;
  }
  return false;
}

const checkInPuzzle = (l: string, guessedLetters: string[][], gameWord: string) => {
  const flatGuesses = guessedLetters.flat();
  if (flatGuesses.includes(l) && gameWord.includes(l)) {
    return true;
  }
  return false;
}

@customElement('keyboard-layout')
export class KeyboardLayout extends SignalWatcher(LitElement) {
  static styles = [
    css`
      :host {
        display: block;
        margin-top: 1.5rem;
      }
      .grid {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        max-width: 580px;
        margin: 0 auto;
      }
      .grid-row {
        display: flex;
        align-items: flex-start;
        justify-items: center;
        justify-content: center;
        max-width: 100%;
        margin: 0 auto;
        gap: 4px;
        width: 100%;
        @media (min-width: 500px) {
          width: 484px;
        }
      }
    `
  ];

  render() {
    const guesses = gameState.get().guesses;
    const currentGuess = gameState.get().currentGuess;
    const gameWord = gameState.get().gameWord;
    const guessedLetters = {} as Record<number, string[]>;
    for (const key in guesses) {
      if (Number(key) < currentGuess) {
        guessedLetters[key] = guesses[key];
      }
    }

    const allGuessedLetters = Object.values(guessedLetters) as string[][];

    return html`
    <div class='grid'>
      <div class='grid-row'>
        <wordle-square size='small' letter='q'
          ?isCorrect=${checkIsCorrect('q', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('q', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('q', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='w'
          ?isCorrect=${checkIsCorrect('w', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('w', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('w', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='e'
          ?isCorrect=${checkIsCorrect('e', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('e', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('e', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='r'
          ?isCorrect=${checkIsCorrect('r', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('r', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('r', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='t'
          ?isCorrect=${checkIsCorrect('t', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('t', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('t', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='y'
          ?isCorrect=${checkIsCorrect('y', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('y', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('y', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='u'
          ?isCorrect=${checkIsCorrect('u', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('u', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('u', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='i'
          ?isCorrect=${checkIsCorrect('i', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('i', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('i', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='o'
          ?isCorrect=${checkIsCorrect('o', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('o', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('o', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='p'
          ?isCorrect=${checkIsCorrect('p', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('p', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('p', allGuessedLetters, gameWord)}
        ></wordle-square>
      </div>
      <div class='grid-row'>
      <wordle-square size='small' letter='a'
          ?isCorrect=${checkIsCorrect('a', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('a', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('a', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='s'
          ?isCorrect=${checkIsCorrect('s', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('s', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('s', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='d'
          ?isCorrect=${checkIsCorrect('d', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('d', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('d', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='f'
          ?isCorrect=${checkIsCorrect('f', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('f', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('f', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='g'
          ?isCorrect=${checkIsCorrect('g', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('g', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('g', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='h'
          ?isCorrect=${checkIsCorrect('h', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('h', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('h', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='j'
          ?isCorrect=${checkIsCorrect('j', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('j', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('j', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='k'
          ?isCorrect=${checkIsCorrect('k', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('k', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('k', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='l'
          ?isCorrect=${checkIsCorrect('l', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('l', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('l', allGuessedLetters, gameWord)}
        ></wordle-square>
      </div>
      <div class='grid-row'>
        <wordle-square size='medium' letter='Enter'></wordle-square>
        <wordle-square size='small' letter='z'
          ?isCorrect=${checkIsCorrect('z', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('z', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('z', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='x'
          ?isCorrect=${checkIsCorrect('x', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('x', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('x', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='c'
          ?isCorrect=${checkIsCorrect('c', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('c', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('c', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='v'
          ?isCorrect=${checkIsCorrect('v', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('v', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('v', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='b'
          ?isCorrect=${checkIsCorrect('b', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('b', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('b', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='n'
          ?isCorrect=${checkIsCorrect('n', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('n', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('n', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='small' letter='m'
          ?isCorrect=${checkIsCorrect('m', allGuessedLetters, gameWord)}
          ?notInPuzzle=${checkNotInPuzzle('m', allGuessedLetters, gameWord)}
          ?inPuzzle=${checkInPuzzle('m', allGuessedLetters, gameWord)}
        ></wordle-square>
        <wordle-square size='medium' letter='Backspace'></wordle-square>
      </div>
    </div>
    `;
  }
}

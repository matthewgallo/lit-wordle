import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import {SignalWatcher, signal} from '@lit-labs/signals';
import wordExists from 'word-exists';
import { classMap } from 'lit/directives/class-map.js';
// const engWords = isWord('american-english');
import './square';
import './keyboard-layout';

const defaultGuesses = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
} as Record<number, string[]>;

// Could be global store
export const gameState = signal({
  value: 0,
  guesses: defaultGuesses,
  gameWord: '',
  gameWon: false,
  gameOver: false,
  notWord: null as null | number,
  scores: [] as {
    won: boolean;
    timestamp: number;
    guessCount: number;
  }[],
});

import { words } from './assets/words';

const isAlphabetic = (key: string) => {
  return /^[a-zA-Z]$/.test(key);
}

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('game-board')
export class GameBoard extends SignalWatcher(LitElement) {

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('keydown', this._handleKeydown);
  }

  _handleKeydown (event: KeyboardEvent) {
    if (!gameState.get().gameWord.length) {
      return;
    }
    const guessNumber = gameState.get().value;
    const gameWord = gameState.get().gameWord;
    const prevCurrentGuess = gameState.get().guesses[guessNumber];
    if (prevCurrentGuess.length > 0 && event.key === 'Backspace') {
      prevCurrentGuess.pop();
      const newGuesses = {...gameState.get().guesses};
      newGuesses[guessNumber] = [...prevCurrentGuess];
      gameState.set({
        ...gameState.get(),
        guesses: newGuesses,
      });
    }
    if (prevCurrentGuess.length === 5 && event.key === 'Enter') {
      // Entered word, is not a valid word
      if (!wordExists(prevCurrentGuess.join(''))) {
        gameState.set({
          ...gameState.get(),
          notWord: gameState.get().value,
        });
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
              guessCount: gameState.get().value + 1
            }
          ]
        });
      }
      if (guessNumber === 5) {
        // Game over, last guess
        console.log('Game over');
        gameState.set({
          ...gameState.get(),
          gameOver: true,
          gameWon: false,
          scores: [
            ...gameState.get().scores,
            {
              won: false,
              timestamp: Date.now(),
              guessCount: gameState.get().value + 1
            }
          ]
        })
        return;
      }
      gameState.set({
        ...gameState.get(),
        value: gameState.get().value + 1,
      });
    }
    if (!isAlphabetic(event.key) || prevCurrentGuess.length === 5) return;
    
    const newGuesses = {...gameState.get().guesses};
    newGuesses[guessNumber] = [...prevCurrentGuess, event.key]
    gameState.set({
      ...gameState.get(),
      guesses: newGuesses
    });
  }

  _onNewGame (event: Event) {
    const newGameWord = words[Math.floor(Math.random() * words.length)];
    gameState.set({
      ...gameState.get(),
      gameWord: newGameWord.toLowerCase(),
      guesses: defaultGuesses,
      value: 0,
      gameWon: false,
      gameOver: false,
    });
    if (event.target) {
      (event.target as HTMLButtonElement).blur();
    }
  }

  render() {
    const data = Object.values(gameState.get().guesses)
    const gameWord = gameState.get().gameWord;
    console.log(gameState.get());
    return html`
      <slot></slot>
      <h1 class='game-message-header'>
        ${gameState.get().gameWon && gameState.get().gameOver ? 'You won!' : null}
        ${!gameState.get().gameWon && gameState.get().gameOver ? html`
          <span class='lose-message'>Better luck next time!</span>
          <span class='game-word'>${gameState.get().gameWord}</span>` : null}
      </h1>
      <div class="card">
        <button @click=${(e: Event) => this._onNewGame(e)} part="button">
          ${!gameState.get().gameWord.length
              ? 'Start a new game'
              : gameState.get().gameOver ? 'Play again' : 'Restart'
          }
        </button>
      </div>
      ${data.map((d, index) => {
        const blankSquareCount = 5 - (d.length ?? 0);
        const blankSquareArr = Array.from(Array(blankSquareCount).keys());
        return html`<div>
          <div class=${classMap({
            "wordle-row": true,
            'not-a-word': gameState.get().notWord === index
          })}>
            ${d.map((letter, letterIndex) => html`
            <wordle-square
              .letter=${letter}
              ?notInPuzzle=${(gameState.get().value > index || gameState.get().gameOver) && !gameWord.includes(letter)}
              ?inPuzzle=${(gameState.get().value > index || gameState.get().gameOver) && gameWord.includes(letter)}
              ?isCorrect=${(gameState.get().value > index || gameState.get().gameOver) && gameWord.charAt(letterIndex) === letter}
            ></wordle-square>`)}
            ${blankSquareArr.map(() => html`<wordle-square letter=''></wordle-square>`)}
          </div>
        </div>`
      })}
      <keyboard-layout></keyboard-layout>
    `
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: all 250ms;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }


    .wordle-row {
      display: flex;
      justify-content: center;
    }

    .lose-message {
      display: block;
    }

    .game-word {
      font-style: italic;
      font-size: 1.5rem;
      text-shadow: 1px 1px 2px black, 0 0 1em goldenrod, 0 0 0.2em goldenrod;
    }
    .not-a-word {
      animation: shake .5s ease-in-out;
    }

    @keyframes shake {
      0% {
        transform: translateX(0);
      }

      20% {
        transform: translateX(-10px);
      }

      40% {
        transform: translateX(10px);
      }

      60% {
        transform: translateX(-10px);
      }

      80% {
        transform: translateX(10px);
      }

      100% {
        transform: translateX(0);
      }
    }
    .game-message-header {
      margin: 0;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'game-board': GameBoard
  }
}

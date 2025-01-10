import { LitElement, PropertyValues, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/signals';
import { classMap } from 'lit/directives/class-map.js';
import { words } from './assets/words';
import { gameKeydown } from './utilities/game-keydown';
import './square';
import './keyboard-layout';
import { defaultGuesses, gameScore, gameState } from './game-state';

export const LIT_WORDLE_SCORE = 'lit-wordle-score';

export const setLocalStorageItem = (key = LIT_WORDLE_SCORE, value: gameScore[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting local storage item:", error);
  }
}

export const getLocalStorageItem = (key = LIT_WORDLE_SCORE) => {
  try {
    if (localStorage.getItem(key)) {
      return JSON.parse(localStorage.getItem(key) ?? '') ?? [];
    } else {
      localStorage.setItem(key, JSON.stringify([]));
    }
  } catch (error) {
    console.error("Error setting local storage item:", error);
  }
}

const compareScores = (
  gameScore: gameScore[],
  localStorageScore: gameScore[] = []
) => {
  return (
      gameScore.length === localStorageScore.length &&
      gameScore.every((score) =>
          localStorageScore.some((score2) =>
              Object.keys(score).every((k: string) => (score as gameScore)[k] === (score2 as gameScore)[k])
          )
      )
  );
};

@customElement('game-board')
export class GameBoard extends SignalWatcher(LitElement) {

  constructor() {
    super();
    const newGameWord = words[Math.floor(Math.random() * words.length)];
    gameState.set({
      ...gameState.get(),
      gameWord: newGameWord.toLowerCase(),
      guesses: defaultGuesses,
      currentGuess: 0,
      gameWon: false,
      gameOver: false,
    });
  }

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('keydown', this._handleKeydown);
  }

  update(changes: PropertyValues<this>) {
    // If actual and local storage scores are different then we need to update them both
    if (!compareScores(gameState.get().scores, getLocalStorageItem())) {
      const currentLocalStorageScore = getLocalStorageItem();
      const newScores = [...currentLocalStorageScore, gameState.get().scores].flat()
      const cleanedScores = newScores.filter(
        (s, index) => index === newScores.findIndex(
          o => s.timestamp === o.timestamp
        ));
      setLocalStorageItem(LIT_WORDLE_SCORE, cleanedScores);
      gameState.set({
        ...gameState.get(),
        scores: newScores,
      })
    }
    super.update(changes);
  }

  _handleKeydown(event: KeyboardEvent) {
    gameKeydown(event);
  }

  // Resets for new game
  _onNewGame(event: Event) {
    const newGameWord = words[Math.floor(Math.random() * words.length)];
    gameState.set({
      ...gameState.get(),
      gameWord: newGameWord.toLowerCase(),
      guesses: defaultGuesses,
      currentGuess: 0,
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
    return html`
      ${gameState.get().gameOver ? html`<div class='overlay'></div>`: null}
      ${!gameState.get().gameWon && gameState.get().gameOver
          ? html`<div class='game-notification game-notification-word'>
            ${Array.from(gameWord).map(l =>
              html`<wordle-square compact .letter=${l} ?isCorrect=${true} size='small'></wordle-square>`)}</div>`
          : null
        }
      <div
        class=${classMap({'game-notification': true, showMessage: gameState.get().gameOver, hideMessage: !gameState.get().gameOver})}
        >
        ${gameState.get().gameWon && gameState.get().gameOver ? html`You won!` : null}
        ${!gameState.get().gameWon && gameState.get().gameOver ? html`Better luck next time!` : null}
        <cds-button
          @click=${(e: Event) => this._onNewGame(e)}
          class='play-again'
          size='sm'
          kind='ghost'
        >
          Play again
        </cds-button>
      </div>
      <div class='game-row-wrapper'>
        ${data.map((d, index) => {
          const blankSquareCount = 5 - (d.length ?? 0);
          const blankSquareArr = Array.from(Array(blankSquareCount).keys());
          return html`
            <div class=${classMap({
              "wordle-row": true,
              'not-a-word': gameState.get().notWord === index
            })}>
              ${d.map((letter, letterIndex) => html`
              <wordle-square
                .letter=${letter}
                ?notInPuzzle=${(gameState.get().currentGuess > index || gameState.get().gameOver) && !gameWord.includes(letter)}
                ?inPuzzle=${(gameState.get().currentGuess > index || gameState.get().gameOver) && gameWord.includes(letter) && d.indexOf(letter) !== Array.from(gameWord).indexOf(letter) && Array.from(gameWord).indexOf(letter) > -1}
                ?isCorrect=${(gameState.get().currentGuess > index || gameState.get().gameOver) && gameWord.charAt(letterIndex) === letter}
              ></wordle-square>`)}
              ${blankSquareArr.map(() => html`<wordle-square letter=''></wordle-square>`)}
            </div>`
        })}
      </div>
      <keyboard-layout></keyboard-layout>
    `
  }

  static styles = css`
    :host {
      max-width: 100%;
      margin: 0 auto;
      padding-top: 2rem;
      text-align: center;
      width: 100%;
      min-width: 320px;
      margin-top: 2rem;
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

    .game-button-wrapper {
      padding: 2em;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .play-again {
      position: absolute;
      right: 1rem;
      top: 0.5rem;
    }

    .wordle-row {
      display: flex;
      justify-content: center;
      max-width: 355px;
      margin: 0 auto;
      gap: 8px;
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
    .game-notification {
      height: 3rem;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 1rem;
      opacity: 0;
      border-left: 2px solid green;
      width: 320px;
      background-color: var(--cds-field-01);
      display: flex;
      align-items: center;
      padding: 0 1rem;

      margin-left: auto;
      margin-right: auto;
      transition-property: display, opacity, transform;
      transition-duration: 350ms;
      transition-behavior: allow-discrete;
      transform: translateY(2rem);
      box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    }
    .game-notification.hideMessage {
      opacity: 0;
    }
    .game-notification.showMessage {
      @starting-style {
        opacity: 0;
      }
      opacity: 1;
      transform: translateY(0);
    }
    .game-notification.game-notification-word {
      border-left: none;
      top: 4rem;
      display: flex;
      justify-content: center;
      opacity: 1;
      background-color: var(--cds-field-01);
      gap: 4px;
      height: 5rem;
      width: fit-content;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'game-board': GameBoard
  }
}

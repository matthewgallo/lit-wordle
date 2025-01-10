import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js'
import { SignalWatcher } from '@lit-labs/signals';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { getLocalStorageItem, LIT_WORDLE_SCORE, setLocalStorageItem } from './game-board';
import { type gameScore, gameState } from './game-state';
import '@carbon/web-components/es/components/icon-button/index.js';
import '@carbon/web-components/es/components/modal/index.js';
import '@carbon/web-components/es/components/button/index.js';

@customElement('score-card')
export class ScoreCard extends SignalWatcher(LitElement) {
  @state()
  private scoreCardOpen = false;
  static styles = [
    css`
      :host {
        display: block;
        background-color: red;
        font-style: inherit;
      }
      :host(cds-modal[open]) .cds--modal-container {
        background-color: blue;
      }
      .score-card-button {
        position: fixed;
        top: 1rem;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        max-width: 180px;
        text-align: center;
        height: 2rem;
        background-color: var(--cds-field-01);
        cursor: pointer;
        text-align: center;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0;
        transition: background-color 350ms;
        &:hover {
          background-color: var(--cds-background-hover);
        }
      }

      .score-bar-wrapper {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
        width: 420px;
        max-width: 100%;
      }
      .score-bar {
        min-width: 0.5rem;
        min-height: 0.5rem;
        background-color: var(--cds-border-strong-01);
        margin-left: 0.5rem;
        padding: 0 0.5rem;
        box-sizing: border-box;
      }
      .game-stats {
        display: flex;
        margin-bottom: 2rem;
      }
      .stat {
        display: flex;
        flex-direction: column;
        margin-right: 1rem;
      }
      .stat-callout-number {
        font-size: 2rem;
      }
      .highest {
        background-color: green;
        width: 100%;
      }
    `
  ];

  greatestConsecutive(array: gameScore[]) {
    let maxCount = 0;
    let currentCount = 0;
  
    for (let i = 0; i < array.length; i++) {
      if (array[i].won) {
        currentCount++;
        maxCount = Math.max(maxCount, currentCount);
      } else {
        currentCount = 0;
      }
    }
  
    return maxCount;
  }

  render() {
    const scores = getLocalStorageItem();
    const checkWinStreak = (games: gameScore[]) => {
      let streak = 0;
      let foundLoss = false;
      if (games) {
        games.forEach(game => {
          if (game.won && !foundLoss) {
            streak += 1;
          } else {
            foundLoss = true;
          };
        });
      }
      return streak;
    }
    const reversedScores = [...scores].reverse();

    const results: Record<number, number> = scores.reduce((acc: { [key: number]: number }, o: gameScore) => (acc[o.guessCount] = (acc[o.guessCount] || 0) + 1, acc), {});
    const highestOccurrence = Object.keys(results).reduce((a, b) => results[a] > results[parseInt(b)] ? a : parseInt(b), 0);

    return html`
    ${
      gameState.get().gameOver
        ? html`<button
        size='sm'
        kind='ghost'
        class='score-card-button'
        button-class-name='score-card-button-part'
        @click=${() => this.scoreCardOpen = true}
        part='score-button'
      >
        View scores
      </button>`
        : null
    }
    <cds-modal id="modal-example" ?open=${this.scoreCardOpen} @cds-modal-closed=${() => this.scoreCardOpen = false}>
      <cds-modal-header>
        <cds-modal-close-button></cds-modal-close-button>
        <cds-modal-heading>Game scores</cds-modal-heading>
      </cds-modal-header>
      <cds-modal-body>
        <div class='game-stats'>
          <div class='stat'>
            <span class='stat-callout-number'>${scores.length ?? 0}</span>
            <span>Played</span>
          </div>
          <div class='stat'>
            <span class='stat-callout-number'>${scores.length ? Math.round(scores.filter((s: gameScore) => s.won).length / scores.length * 100) : 0}</span>
            <span>Win %</span>
          </div>
          <div class='stat'>
            <span class='stat-callout-number'>${checkWinStreak(reversedScores)}</span>
            <span>Current streak</span>
          </div>
          <div class='stat'>
            <span class='stat-callout-number'>${this.greatestConsecutive(scores)}</span>
            <span>Max streak</span>
          </div>
        </div>
        <p>Guess distribution</p>
        <div class='score-bar-wrapper'>
          <span class='score-number'>1</span>
          <span
            class=${classMap({'score-bar': true, highest: highestOccurrence === 1})}
            style=${styleMap({
              width: highestOccurrence === 1 ? '100%' : `${results[1] / results[highestOccurrence] * 100}%`
            })}
          >${scores.length ? scores.filter((s: gameScore) => s.guessCount === 1).length : 0}</span>
        </div>
        <div class='score-bar-wrapper'>
          <span class='score-number'>2</span>
          <span
            class=${classMap({'score-bar': true, highest: highestOccurrence === 2})}
            style=${styleMap({
              width: highestOccurrence === 1 ? '100%' : `${results[2] / results[highestOccurrence] * 100}%`
            })}
          >${scores.length ? scores.filter((s: gameScore) => s.guessCount === 2).length : 0}</span>
        </div>
        <div class='score-bar-wrapper'>
          <span class='score-number'>3</span>
          <span
            class=${classMap({'score-bar': true, highest: highestOccurrence === 3})}
            style=${styleMap({
              width: highestOccurrence === 1 ? '100%' : `${results[3] / results[highestOccurrence] * 100}%`
            })}
          >${scores.length ? scores.filter((s: gameScore) => s.guessCount === 3).length : 0}</span>
        </div>
        <div class='score-bar-wrapper'>
          <span class='score-number'>4</span>
          <span
            class=${classMap({'score-bar': true, highest: highestOccurrence === 4})}
            style=${styleMap({
              width: highestOccurrence === 1 ? '100%' : `${results[4] / results[highestOccurrence] * 100}%`
            })}
          >${scores.length ? scores.filter((s: gameScore) => s.guessCount === 4).length : 0}</span>
        </div>
        <div class='score-bar-wrapper'>
          <span class='score-number'>5</span>
          <span
            class=${classMap({'score-bar': true, highest: highestOccurrence === 5})}
            style=${styleMap({
              width: highestOccurrence === 1 ? '100%' : `${results[5] / results[highestOccurrence] * 100}%`
            })}
          >${scores.length ? scores.filter((s: gameScore) => s.guessCount === 5).length : 0}</span>
        </div>
        <div class='score-bar-wrapper'>
          <span class='score-number'>6</span>
          <span
            class=${classMap({'score-bar': true, highest: highestOccurrence === 6})}
            style=${styleMap({
              width: highestOccurrence === 1 ? '100%' : `${results[6] / results[highestOccurrence] * 100}%`
            })}
          >${scores.length ? scores.filter((s: gameScore) => s.guessCount === 6).length : 0}</span>
        </div>
        <cds-button kind='ghost' @click=${() => {
          setLocalStorageItem(LIT_WORDLE_SCORE, [])
          gameState.set({
          ...gameState.get(),
          scores: [],
          });
          this.requestUpdate(); 
        }}
        >Reset scores</cds-button>
      </cds-modal-body>
      <cds-modal-footer>
        <cds-modal-footer-button kind="secondary" data-modal-close
          >Cancel</cds-modal-footer-button>
      </cds-modal-footer>
    </cds-modal>
    `;
  }
}

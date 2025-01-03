import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js'
import { SignalWatcher } from '@lit-labs/signals';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import '@carbon/web-components/es/components/icon-button/index.js';
import '@carbon/web-components/es/components/modal/index.js';
import '@carbon/web-components/es/components/button/index.js';
import { type gameScore, getLocalStorageItem, LIT_WORDLE_SCORE, setLocalStorageItem } from './game-board';

@customElement('score-card')
export class ScoreCard extends SignalWatcher(LitElement) {
  @state()
  private scoreCardOpen = false;
  static styles = [
    css`
      :host {
        display: block;
        background-color: red;
      }
      :host(cds-modal[open]) .cds--modal-container {
        background-color: blue;
      }
      .settings-icon {
        width: 1rem;
        height: 1rem;
        fill: #fff;
      }
      .score-card-button {
        position: fixed;
        bottom: 1.5rem;
        left: 1.5rem;
        width: 2rem;
        height: 2rem;
        border-radius: 100%;
        border: 0;
        background-color: var(--cds-background);
        transition: background-color 250ms;
        cursor: pointer;
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
    <button class='score-card-button' @click=${() => this.scoreCardOpen = true}>
      <svg class='settings-icon' id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><style>.cls-1{fill:none;}</style></defs><title>settings</title><path d="M27,16.76c0-.25,0-.5,0-.76s0-.51,0-.77l1.92-1.68A2,2,0,0,0,29.3,11L26.94,7a2,2,0,0,0-1.73-1,2,2,0,0,0-.64.1l-2.43.82a11.35,11.35,0,0,0-1.31-.75l-.51-2.52a2,2,0,0,0-2-1.61H13.64a2,2,0,0,0-2,1.61l-.51,2.52a11.48,11.48,0,0,0-1.32.75L7.43,6.06A2,2,0,0,0,6.79,6,2,2,0,0,0,5.06,7L2.7,11a2,2,0,0,0,.41,2.51L5,15.24c0,.25,0,.5,0,.76s0,.51,0,.77L3.11,18.45A2,2,0,0,0,2.7,21L5.06,25a2,2,0,0,0,1.73,1,2,2,0,0,0,.64-.1l2.43-.82a11.35,11.35,0,0,0,1.31.75l.51,2.52a2,2,0,0,0,2,1.61h4.72a2,2,0,0,0,2-1.61l.51-2.52a11.48,11.48,0,0,0,1.32-.75l2.42.82a2,2,0,0,0,.64.1,2,2,0,0,0,1.73-1L29.3,21a2,2,0,0,0-.41-2.51ZM25.21,24l-3.43-1.16a8.86,8.86,0,0,1-2.71,1.57L18.36,28H13.64l-.71-3.55a9.36,9.36,0,0,1-2.7-1.57L6.79,24,4.43,20l2.72-2.4a8.9,8.9,0,0,1,0-3.13L4.43,12,6.79,8l3.43,1.16a8.86,8.86,0,0,1,2.71-1.57L13.64,4h4.72l.71,3.55a9.36,9.36,0,0,1,2.7,1.57L25.21,8,27.57,12l-2.72,2.4a8.9,8.9,0,0,1,0,3.13L27.57,20Z" transform="translate(0 0)"/><path d="M16,22a6,6,0,1,1,6-6A5.94,5.94,0,0,1,16,22Zm0-10a3.91,3.91,0,0,0-4,4,3.91,3.91,0,0,0,4,4,3.91,3.91,0,0,0,4-4A3.91,3.91,0,0,0,16,12Z" transform="translate(0 0)"/><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"/></svg>
    </button>
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
        <cds-button kind='ghost' @click=${() => setLocalStorageItem(LIT_WORDLE_SCORE, [])}>Reset scores</cds-button>
      </cds-modal-body>
      <cds-modal-footer>
        <cds-modal-footer-button kind="secondary" data-modal-close
          >Cancel</cds-modal-footer-button>
      </cds-modal-footer>
    </cds-modal>
    `;
  }
}

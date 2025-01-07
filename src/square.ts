import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js';
import { gameKeydown } from './utilities/game-keydown';

@customElement('wordle-square')
export class WordleSquare extends LitElement {

  /**
   * The letter for this square
   */
  @property({ type: String })
  letter = ''

  /**
   * Letter is not in puzzle
   */
  @property({ type: Boolean })
  notInPuzzle = false

  /**
   * Letter is in puzzle but not in correct place
   */
  @property({ type: Boolean })
  inPuzzle = false

  /**
   * Letter is in puzzle and is in correct place
   */
  @property({ type: Boolean })
  isCorrect = false

  /**
   * Letter size
   */
  @property({ type: String })
  size = ''

  static styles = [
    css`
      :host {
        display: flex;
        text-transform: uppercase;
        font-weight: 600;
        width: 100%;
        align-items: center;
        justify-content: center;
      }
      :host([size='small']) {
        max-width: 36px;
        width: 8vw;
        max-height: 58px;
        margin-bottom: 0.5rem;
        height: 58px;
        @media (min-width: 500px) {
          max-width: 42px;
        }
      }
      :host([size='medium']) {
        max-width: 64px;
        max-height: 58px;
        height: 58px;
      }

      .square {
        border: 2px solid var(--cds-border-subtle-01);
        height: 4rem;
        width: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
        transition: background-color 400ms;
      }
      .notInPuzzle {
        background-color: gray;
      }
      .isInPuzzle {
        background-color: goldenrod;
      }
      .isCorrect {
        background-color: green;
      }
      .small, .medium {
        width: 100%;
        height: 100%;
        margin: 0;
        text-transform: uppercase;
        background-color: transparent;
        font-family: inherit;
        cursor: pointer;
      }
      .medium {
        height: 58px;
      }
    `
  ];

  render() {
    const classes = {
      isCorrect: this.isCorrect,
      isInPuzzle: this.inPuzzle,
      notInPuzzle: this.notInPuzzle,
      square: true,
      small: this.size === 'small',
      medium: this.size === 'medium'
    };

    return this.size === 'small' || this.size === 'medium' ? html`<button
      class=${classMap(classes)}
      @click=${(event: any) => gameKeydown(event, this.letter)}
      >
      ${this.letter === 'Backspace' ? html`<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" class="game-icon" data-testid="icon-backspace"><path fill="#fff" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path></svg>` : this.letter}
    </button>` : html`<div class=${classMap(classes)}>
      ${this.letter}
    </div>`;
  }
}

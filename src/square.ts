import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js';

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
  @property({ type: Boolean })
  small = false

  static styles = [
    css`
      :host {
        display: flex;
        text-transform: uppercase;
        font-weight: 600;
        width: 100%;
        aspect-ratio: 1 / 1;
        align-items: center;
        justify-content: center;
      }
      :host([small]) {
        max-width: 48px;
        max-height: 48px;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
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
      .small {
        width: 100%;
        height: 100%;
        margin: 0;
      }
    `
  ];

  render() {
    const classes = {
      isCorrect: this.isCorrect,
      isInPuzzle: this.inPuzzle,
      notInPuzzle: this.notInPuzzle,
      square: true,
      small: this.small
    };

    return html`<div class=${classMap(classes)}>
      ${this.letter}
    </div>`;
  }
}

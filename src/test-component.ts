import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js'
import { SignalWatcher } from '@lit-labs/signals';
import { count } from './signal-count';

@customElement('test-component')
export class TestComponent extends SignalWatcher(LitElement) {
  static styles = [
    css`
      :host {
        display: block;
      }
    `
  ];
  
  render() {
    return html`test component!!! ${count.get().value}`;
  }
}

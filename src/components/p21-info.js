import { LitElement, css, html } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { icon } from '../icons.js';

/**
 * Header panel: toolbar, level/goal dots, score, turn timer and the current expression.
 *
 * Events: p21-toggle-play, p21-new-game, p21-toggle-size, p21-toggle-sound
 */
export class P21Info extends LitElement {
  static properties = {
    score: { type: Number },
    level: { type: Number },
    goal: { type: Number },
    message: { type: String },
    size: { type: Number },
    sound: { type: Boolean },
    /** { running, started, duration, turn } from the app's TurnTimer */
    timer: { attribute: false },
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 2cqi;
      padding: 3cqi;
      box-sizing: border-box;
      container-type: inline-size;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .toolbar {
      display: flex;
      gap: 1cqi;
    }
    button {
      display: inline-grid;
      place-items: center;
      width: 11cqi;
      height: 11cqi;
      max-width: 48px;
      max-height: 48px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: none;
      color: #333;
      cursor: pointer;
    }
    button:hover {
      background: #0001;
    }
    button:focus-visible {
      outline: 2px solid #6200ea;
    }
    button svg {
      width: 60%;
      height: 60%;
    }
    .instructions {
      font-size: 4.5cqi;
      color: #444;
    }
    .logo {
      font-size: 22cqi;
      font-weight: 900;
      line-height: 0.9;
      width: auto;
      height: auto;
      max-width: none;
      max-height: none;
      border-radius: 2cqi;
      color: #1a1a2e;
    }
    .stats {
      display: flex;
      gap: 2cqi;
      height: 20cqi;
    }
    .section {
      background: #9e9e9e;
      color: #111;
      border-radius: 2.5cqi;
      padding: 1.5cqi 2.5cqi;
      display: flex;
      flex-direction: column;
      font-size: 4cqi;
    }
    .level {
      flex-direction: row;
      gap: 2cqi;
    }
    .level > div {
      display: flex;
      flex-direction: column;
    }
    .score {
      flex: 1;
    }
    .value {
      font-size: 11cqi;
      font-weight: 700;
      flex: 1;
      display: flex;
      align-items: center;
    }
    .dots {
      display: flex;
      flex-direction: column-reverse;
      justify-content: center;
      gap: 0.8cqi;
    }
    .dot {
      width: 2cqi;
      height: 2cqi;
      border-radius: 50%;
      border: 2px solid pink;
    }
    .dot.on {
      background: pink;
    }
    .timer {
      width: 6cqi;
      display: flex;
      align-items: flex-end;
      border-radius: 1.5cqi;
      background: #eee;
      overflow: hidden;
      cursor: pointer;
    }
    .bar {
      width: 100%;
      height: 100%;
      background: #e53935;
      transform-origin: bottom;
    }
    .bar.run {
      animation: drain linear forwards;
    }
    @keyframes drain {
      to {
        transform: scaleY(0.01);
      }
    }
    .message {
      min-height: 1.3em;
      font-size: 8cqi;
      font-weight: 700;
      text-align: center;
    }
  `;

  /** Viewport rectangle of the score, where scoring animations land. */
  scoreRect() {
    return this.renderRoot.querySelector('.score .value').getBoundingClientRect();
  }

  #emit(name) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  render() {
    const t = this.timer ?? {};
    return html`
      <div class="top">
        <div>
          <div class="toolbar">
            <button
              aria-label=${t.running ? 'Pause' : 'Play'}
              title=${t.running ? 'Pause' : 'Play'}
              @click=${() => this.#emit('p21-toggle-play')}
            >
              ${icon(t.running ? 'pause' : 'play')}
            </button>
            <button aria-label="New game" title="New game" @click=${() => this.#emit('p21-new-game')}>
              ${icon('replay')}
            </button>
            <button
              aria-label="Board size ${this.size}×${this.size}"
              title="Switch to ${this.size === 5 ? 4 : 5}×${this.size === 5 ? 4 : 5}"
              @click=${() => this.#emit('p21-toggle-size')}
            >
              ${icon('grid')}
            </button>
            <button
              aria-label=${this.sound ? 'Mute' : 'Unmute'}
              title=${this.sound ? 'Mute' : 'Unmute'}
              aria-pressed=${this.sound}
              @click=${() => this.#emit('p21-toggle-sound')}
            >
              ${icon(this.sound ? 'volumeOn' : 'volumeOff')}
            </button>
          </div>
          <div class="instructions">move the numbers to make</div>
        </div>
        <button class="logo" title="New game" @click=${() => this.#emit('p21-new-game')}>21</button>
      </div>

      <div class="stats">
        <div class="section level">
          <div>
            <span>Level</span>
            <span class="value">${this.level}</span>
          </div>
          <div class="dots" aria-label="Goal ${this.goal} of 5">
            ${[1, 2, 3, 4, 5].map((i) => html`<span class="dot ${i <= this.goal ? 'on' : ''}"></span>`)}
          </div>
        </div>
        <div class="section score">
          <span>Score</span>
          <span class="value">${this.score}</span>
        </div>
        <div
          class="timer"
          role="progressbar"
          aria-label="Time until the next number"
          @click=${() => this.#emit('p21-toggle-play')}
        >
          ${keyed(
            t.turn,
            html`<div
              class="bar ${t.started ? 'run' : ''}"
              style="animation-duration:${t.duration}ms;animation-play-state:${t.running ? 'running' : 'paused'}"
            ></div>`,
          )}
        </div>
      </div>

      <div class="message" aria-live="polite">${this.message}</div>
    `;
  }
}

customElements.define('p21-info', P21Info);

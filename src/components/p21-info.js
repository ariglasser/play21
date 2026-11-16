import { LitElement, css, html, nothing } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { icon } from '../icons.js';

/**
 * Header panel: logo, toolbar, level/goal dots, score and best, game mode,
 * turn timer (timed mode) and the current expression.
 *
 * Events: p21-toggle-play, p21-new-game, p21-toggle-size, p21-toggle-sound, p21-help,
 *         p21-mode {mode: 'timed' | 'endless'}
 */
export class P21Info extends LitElement {
  static properties = {
    score: { type: Number },
    best: { type: Number },
    level: { type: Number },
    goal: { type: Number },
    /** 'timed' | 'endless' */
    mode: { type: String },
    message: { type: String },
    size: { type: Number },
    sound: { type: Boolean },
    /** Board is nearly full: the timer turns urgent. */
    danger: { type: Boolean },
    /** { running, started, duration, turn } from the app's TurnTimer */
    timer: { attribute: false },
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 3cqi;
      padding: 4cqi 4cqi 2cqi;
      box-sizing: border-box;
      container-type: inline-size;
      color: var(--chalk);
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2cqi;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 2.5cqi;
      background: none;
      border: 0;
      padding: 0;
      color: inherit;
      cursor: pointer;
      text-align: left;
    }
    .logo {
      font-family: var(--font-display);
      font-size: 15cqi;
      line-height: 0.8;
      color: var(--gold);
      text-shadow:
        0 0.05em 0 var(--gold-deep),
        0 0.1em 0.2em #0008;
    }
    .tagline {
      font-size: 3.6cqi;
      font-weight: 700;
      line-height: 1.2;
      color: var(--chalk-dim);
      max-width: 19cqi;
    }
    .tagline strong {
      display: block;
      font-family: var(--font-display);
      font-weight: 400;
      font-size: 5.4cqi;
      color: var(--chalk);
      letter-spacing: 0.04em;
    }
    .toolbar {
      display: flex;
      justify-content: flex-end;
      gap: 1.2cqi;
    }
    button.icon {
      display: inline-grid;
      place-items: center;
      width: 8.4cqi;
      height: 8.4cqi;
      max-width: 44px;
      max-height: 44px;
      min-width: 30px;
      min-height: 30px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: var(--felt-deep);
      color: var(--chalk);
      cursor: pointer;
      box-shadow: inset 0 0 0 1px var(--felt-line);
    }
    button.icon:hover {
      background: var(--felt);
    }
    button:focus-visible {
      outline: 2px solid var(--gold);
      outline-offset: 2px;
    }
    button.icon svg {
      width: 58%;
      height: 58%;
    }
    .stats {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 2.5cqi;
    }
    .stat {
      background: var(--felt-deep);
      border-radius: 3cqi;
      padding: 2cqi 3cqi;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1cqi;
      min-width: 0;
      box-shadow: inset 0 0 0 1px var(--felt-line);
    }
    .name {
      font-size: 3cqi;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--chalk-dim);
    }
    .value {
      font-family: var(--font-display);
      font-size: 9cqi;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .score .value {
      color: var(--gold);
    }
    .best {
      font-size: 3.2cqi;
      font-weight: 700;
      color: var(--chalk-dim);
    }
    .dots {
      display: flex;
      gap: 1cqi;
    }
    .dot {
      width: 2.4cqi;
      height: 2.4cqi;
      border-radius: 50%;
      box-shadow: inset 0 0 0 2px var(--gold);
    }
    .dot.on {
      background: var(--gold);
    }
    .modes {
      display: flex;
      flex-direction: column;
      gap: 1.2cqi;
      justify-content: center;
    }
    .modes button {
      display: flex;
      align-items: center;
      gap: 1.2cqi;
      padding: 1cqi 2.4cqi 1cqi 1.6cqi;
      border: 0;
      border-radius: 99px;
      background: none;
      color: var(--chalk-dim);
      font: inherit;
      font-size: 3.4cqi;
      font-weight: 800;
      cursor: pointer;
    }
    .modes button svg {
      width: 4.4cqi;
      height: 4.4cqi;
    }
    .modes button[aria-checked='true'] {
      background: var(--gold);
      color: var(--ink);
      box-shadow: 0 0.5cqi 0 var(--gold-deep);
    }
    .timer {
      height: 2.2cqi;
      border-radius: 99px;
      background: var(--felt-deep);
      box-shadow: inset 0 0 0 1px var(--felt-line);
      overflow: hidden;
      cursor: pointer;
    }
    .bar {
      width: 100%;
      height: 100%;
      background: var(--chalk-dim);
      transform-origin: left;
      border-radius: inherit;
    }
    .bar.run {
      animation: drain linear forwards;
      background: var(--red);
    }
    .danger .bar.run {
      background: var(--red);
      box-shadow: 0 0 10px var(--red);
    }
    @keyframes drain {
      to {
        transform: scaleX(0);
      }
    }
    .message {
      min-height: 1.25em;
      font-size: 6cqi;
      font-weight: 800;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }
    .danger-note {
      color: var(--red);
    }
  `;

  /** Viewport rectangle of the score, where scoring animations land. */
  scoreRect() {
    return this.renderRoot.querySelector('.score .value').getBoundingClientRect();
  }

  #emit(name) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  #button(name, label, event, pressed) {
    return html`<button
      class="icon"
      aria-label=${label}
      title=${label}
      aria-pressed=${pressed ?? 'false'}
      @click=${() => this.#emit(event)}
    >
      ${icon(name)}
    </button>`;
  }

  #mode(value, iconName, label, title) {
    return html`<button
      role="radio"
      aria-checked=${String(this.mode === value)}
      title=${title}
      @click=${() =>
        this.mode !== value &&
        this.dispatchEvent(new CustomEvent('p21-mode', { detail: { mode: value }, bubbles: true, composed: true }))}
    >
      ${icon(iconName)} ${label}
    </button>`;
  }

  render() {
    const t = this.timer ?? {};
    const other = this.size === 5 ? 4 : 5;
    const endless = this.mode === 'endless';
    return html`
      <div class="top">
        <button class="brand" title="New game" @click=${() => this.#emit('p21-new-game')}>
          <span class="logo">21</span>
          <span class="tagline"><strong>Play</strong>slide numbers to make 21</span>
        </button>
        <div class="toolbar">
          ${endless ? nothing : this.#button(t.running ? 'pause' : 'play', t.running ? 'Pause' : 'Play', 'p21-toggle-play')}
          ${this.#button('replay', 'New game', 'p21-new-game')}
          ${this.#button('grid', `Switch to ${other}×${other}`, 'p21-toggle-size')}
          ${this.#button(this.sound ? 'volumeOn' : 'volumeOff', this.sound ? 'Mute' : 'Unmute', 'p21-toggle-sound', String(!!this.sound))}
          ${this.#button('help', 'How to play', 'p21-help')}
        </div>
      </div>

      <div class="stats">
        <div class="stat">
          <span class="name">Level</span>
          <span class="value">${this.level}</span>
          <span class="dots" title="Make 5 × 21 to reach the next level" aria-label="${this.goal} of 5 to next level">
            ${[0, 1, 2, 3, 4].map((i) => html`<span class="dot ${i < this.goal ? 'on' : ''}"></span>`)}
          </span>
        </div>
        <div class="stat score">
          <span class="name">Score</span>
          <span class="value">${this.score}</span>
          <span class="best">Best ${Math.max(this.best ?? 0, this.score ?? 0)}</span>
        </div>
        <div class="stat modes" role="radiogroup" aria-label="Game mode">
          ${this.#mode('timed', 'timer', 'Timed', 'A number also drops when the timer runs out')}
          ${this.#mode('endless', 'endless', 'Endless', 'No timer: a number drops only after each move')}
        </div>
      </div>

      ${endless
        ? nothing
        : html`<div
        class="timer ${this.danger ? 'danger' : ''}"
        role="progressbar"
        aria-label="Time until the next number drops"
        title=${t.running ? 'Pause' : 'Play'}
        @click=${() => this.#emit('p21-toggle-play')}
      >
        ${keyed(
          t.turn,
          html`<div
            class="bar ${t.started ? 'run' : ''}"
            style="animation-duration:${t.duration}ms;animation-play-state:${t.running ? 'running' : 'paused'}"
          ></div>`,
        )}
      </div>`}

      <div class="message ${this.danger && !this.message ? 'danger-note' : ''}" aria-live="polite">
        ${this.message || (this.danger ? 'Board almost full!' : '')}
      </div>
    `;
  }
}

customElements.define('p21-info', P21Info);

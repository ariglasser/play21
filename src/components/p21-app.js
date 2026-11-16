import { LitElement, css, html } from 'lit';
import { Game, levelTime } from '../game.js';
import { TurnTimer } from '../timer.js';
import { sound } from '../sound.js';
import './p21-info.js';
import './p21-board.js';

/** Owns the game state and wires the info panel and board together. */
export class P21App extends LitElement {
  static properties = {
    _revision: { state: true },
    _preview: { state: true },
    _sound: { state: true },
  };

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100dvh;
      padding: 8px;
      box-sizing: border-box;
    }
    .game {
      display: grid;
      grid-template-areas: 'info' 'board';
      width: min(100%, 62dvh);
      border: 1px solid #000;
      border-radius: 16px;
      overflow: hidden;
      background: white;
    }
    @media (orientation: landscape) and (min-aspect-ratio: 5/4) {
      .game {
        grid-template-areas: 'info board';
        grid-template-columns: 1fr 1fr;
        align-items: center;
        width: min(100%, 170dvh);
      }
    }
    p21-info {
      grid-area: info;
    }
    p21-board {
      grid-area: board;
    }
    .fly {
      position: fixed;
      z-index: 10;
      pointer-events: none;
      padding: 4px 10px;
      border: 1px solid #000;
      border-radius: 6px;
      background: #fff8c4;
      font-size: 22px;
      font-weight: 700;
      white-space: nowrap;
    }
  `;

  game = new Game(5);
  timer = new TurnTimer(this, () => this.#nextTurn());

  constructor() {
    super();
    this._revision = 0;
    this._preview = null;
    this._sound = sound.enabled;
  }

  get #message() {
    if (this._preview) return this._preview;
    return this.game.over ? 'Game Over' : this.game.lastText;
  }

  render() {
    const g = this.game;
    return html`
      <div class="game">
        <p21-info
          .score=${g.score}
          .level=${g.level}
          .goal=${g.goal}
          .size=${g.size}
          .message=${this.#message}
          .sound=${this._sound}
          .timer=${{
            running: this.timer.running,
            started: this.timer.started,
            duration: this.timer.duration,
            turn: this.timer.turn,
          }}
          @p21-toggle-play=${this.#togglePlay}
          @p21-new-game=${() => this.#newGame(g.size, true)}
          @p21-toggle-size=${() => this.#newGame(g.size === 5 ? 4 : 5, false)}
          @p21-toggle-sound=${this.#toggleSound}
        ></p21-info>
        <p21-board
          .game=${g}
          .revision=${this._revision}
          @p21-drop=${this.#onDrop}
          @p21-tap=${this.#onTap}
          @p21-preview=${(e) => (this._preview = e.detail.text)}
          @p21-new-game=${() => this.#newGame(g.size, true)}
        ></p21-board>
      </div>
    `;
  }

  #changed() {
    this._revision++;
  }

  /** Drop in a new number and restart the turn timer (or end the game). */
  #nextTurn() {
    if (this.game.spawn() < 0) {
      this.timer.stop();
      sound.play('gameover');
    } else {
      sound.play('newnumber');
      this.timer.start(levelTime(this.game.level));
    }
    this.#changed();
  }

  #onDrop(e) {
    const { from, to } = e.detail;
    const cellRect = this.renderRoot.querySelector('p21-board').cellRect(to);
    const result = this.game.drop(from, to);
    if (!result) return;
    if (result.kind === 'score') {
      sound.play('point');
      if (result.levelUp) sound.play('levelchanged');
      this.#flyScore(cellRect, result.chain);
    }
    this.#nextTurn();
  }

  #onTap(e) {
    if (this.game.pending?.index === e.detail.index && this.game.cycle()) this.#changed();
  }

  #togglePlay() {
    if (this.game.over) return;
    const t = this.timer;
    if (!t.started) t.start(levelTime(this.game.level));
    else if (t.running) {
      t.pause();
      sound.play('pausestate');
    } else t.resume();
  }

  #newGame(size, autostart) {
    this.game.reset(size);
    this._preview = null;
    if (autostart) {
      this.timer.start(levelTime(this.game.level));
      sound.play('gamestart');
    } else {
      this.timer.stop();
    }
    this.#changed();
  }

  #toggleSound() {
    sound.setEnabled(!sound.enabled);
    this._sound = sound.enabled;
  }

  /** Float the winning expression from the cell up to the score. */
  async #flyScore(from, text) {
    await this.updateComplete;
    const to = this.renderRoot.querySelector('p21-info').scoreRect();
    if (!from || !to) return;
    const el = document.createElement('div');
    el.className = 'fly';
    el.textContent = text;
    el.style.left = `${from.left}px`;
    el.style.top = `${from.top}px`;
    this.renderRoot.append(el);
    const dx = to.left + to.width / 2 - el.offsetWidth / 2 - from.left;
    const dy = to.top - from.top;
    const duration = Math.max(400, ((10 - this.game.level) / 6) * 1000);
    await el
      .animate(
        [
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(0.6)`, opacity: 0.2 },
        ],
        { duration, easing: 'ease-in' },
      )
      .finished.catch(() => {});
    el.remove();
  }
}

customElements.define('p21-app', P21App);

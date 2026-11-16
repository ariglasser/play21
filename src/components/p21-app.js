import { LitElement, css, html, nothing } from 'lit';
import { Game, levelTime } from '../game.js';
import { TurnTimer } from '../timer.js';
import { sound } from '../sound.js';
import { STEPS, TUTORIAL_SIZE } from '../tutorial.js';
import { store } from '../store.js';
import './p21-info.js';
import './p21-board.js';

const DANGER_FREE = 3; // empty cells left when the board starts warning

/** Owns the game state and wires the info panel, board and tutorial together. */
export class P21App extends LitElement {
  static properties = {
    _revision: { state: true },
    _preview: { state: true },
    _sound: { state: true },
    _step: { state: true },
    _best: { state: true },
    _newBest: { state: true },
    /** 'timed' | 'endless' */
    _mode: { state: true },
  };

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100%;
      padding: 12px max(12px, env(safe-area-inset-right, 0px)) 12px max(12px, env(safe-area-inset-left, 0px));
      box-sizing: border-box;
    }
    .game {
      display: grid;
      grid-template-areas: 'info' 'coach' 'board';
      width: min(100%, 60dvh, 560px);
      background: linear-gradient(180deg, #17603f, var(--felt) 40%);
      border-radius: 22px;
      box-shadow:
        0 0 0 6px #3b2516,
        0 0 0 8px #24160c,
        0 24px 50px #000a;
      overflow: hidden;
    }
    @media (orientation: landscape) and (min-aspect-ratio: 5/4) {
      .game {
        grid-template-areas: 'info board' 'coach board';
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto 1fr;
        width: min(100%, 165dvh, 1000px);
      }
    }
    p21-info {
      grid-area: info;
    }
    .coach {
      grid-area: coach;
      margin: 0 4% 2%;
      padding: 12px 14px;
      border-radius: 14px;
      background: var(--card);
      color: var(--ink);
      font-weight: 700;
      font-size: 15px;
      line-height: 1.4;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 4px 0 var(--card-edge);
      align-self: start;
    }
    .coach-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .steps {
      display: flex;
      gap: 6px;
    }
    .steps span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--card-edge);
    }
    .steps span.on {
      background: var(--gold-deep);
    }
    .coach button,
    .panel button {
      font: inherit;
      font-weight: 800;
      border: 0;
      border-radius: 999px;
      padding: 8px 16px;
      cursor: pointer;
    }
    .coach button.skip {
      background: none;
      color: #6b6250;
      padding: 8px 4px;
    }
    .primary {
      background: var(--gold);
      color: var(--ink);
      box-shadow: 0 3px 0 var(--gold-deep);
    }
    button:focus-visible {
      outline: 2px solid var(--gold-deep);
      outline-offset: 2px;
    }
    .table {
      grid-area: board;
      position: relative;
      padding: 3%;
      align-self: center;
    }
    .table.danger p21-board {
      animation: warn 1.2s ease-in-out infinite;
      border-radius: 12px;
    }
    @keyframes warn {
      50% {
        box-shadow: 0 0 0 3px var(--red);
      }
    }
    .overlay {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      background: #0b2a1ccc;
      backdrop-filter: blur(2px);
      z-index: 5;
    }
    .panel {
      background: var(--card);
      color: var(--ink);
      border-radius: 18px;
      padding: 22px 26px;
      text-align: center;
      display: grid;
      gap: 6px;
      min-width: 60%;
      box-shadow: 0 6px 0 var(--card-edge), 0 20px 40px #0009;
    }
    .panel h2 {
      margin: 0;
      font-family: var(--font-display);
      font-weight: 400;
      font-size: 28px;
    }
    .panel .big {
      font-family: var(--font-display);
      font-size: 44px;
      color: var(--gold-deep);
      line-height: 1.1;
    }
    .panel .sub {
      font-weight: 700;
      color: #6b6250;
    }
    .badge {
      justify-self: center;
      background: var(--red);
      color: white;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 3px 10px;
      border-radius: 99px;
    }
    .panel button {
      margin-top: 10px;
      font-size: 17px;
      padding: 10px 22px;
    }
    .fly {
      position: fixed;
      z-index: 10;
      pointer-events: none;
      display: grid;
      justify-items: center;
      color: var(--gold);
      text-shadow: 0 2px 0 #0009;
      white-space: nowrap;
    }
    .fly b {
      font-family: var(--font-display);
      font-weight: 400;
      font-size: 34px;
      line-height: 1;
    }
    .fly span {
      font-weight: 800;
      font-size: 15px;
      color: var(--chalk);
    }
    .banner {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      pointer-events: none;
      z-index: 6;
      font-family: var(--font-display);
      font-size: 13cqi;
      color: var(--gold);
      text-shadow: 0 4px 0 var(--gold-deep), 0 10px 30px #000;
      container-type: inline-size;
    }
  `;

  game = new Game(5);
  timer = new TurnTimer(this, () => this.#nextTurn());

  constructor() {
    super();
    this._revision = 0;
    this._preview = null;
    this._sound = sound.enabled;
    this._mode = store.get('mode') === 'endless' ? 'endless' : 'timed';
    this._best = this.#loadBest();
    this._newBest = false;
    this._step = store.get('tutorial') === 'done' ? -1 : 0;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this._step >= 0) this.#startStep(0);
  }

  // Best score is kept per mode ('best' is the key used before modes existed).
  #loadBest() {
    return Number(store.get(`best-${this._mode}`) ?? (this._mode === 'timed' ? store.get('best') : 0)) || 0;
  }

  get #timed() {
    return this._mode === 'timed';
  }

  /** Start the turn timer, in timed mode only. */
  #startTimer() {
    if (this.#timed) this.timer.start(levelTime(this.game.level));
    else this.timer.stop();
  }

  get #tutorial() {
    return this._step >= 0 ? STEPS[this._step] : null;
  }

  get #danger() {
    const playing = this.#timed ? this.timer.started : true;
    return !this.#tutorial && !this.game.over && playing && this.game.free <= DANGER_FREE;
  }

  render() {
    const g = this.game;
    const step = this.#tutorial;
    return html`
      <div class="game">
        <p21-info
          .score=${g.score}
          .best=${this._best}
          .level=${g.level}
          .goal=${g.goal}
          .mode=${this._mode}
          .size=${g.size}
          .message=${this._preview ?? g.lastText}
          .sound=${this._sound}
          .danger=${this.#danger}
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
          @p21-help=${() => this.#startStep(0)}
          @p21-mode=${this.#setMode}
        ></p21-info>
        ${step ? this.#coach(step) : nothing}
        <div class="table ${this.#danger ? 'danger' : ''}">
          <p21-board
            .game=${g}
            .revision=${this._revision}
            .hints=${step?.hints ?? []}
            @p21-drop=${this.#onDrop}
            @p21-tap=${this.#onTap}
            @p21-preview=${(e) => (this._preview = e.detail.text)}
          ></p21-board>
          ${g.over ? this.#gameOver() : nothing}
        </div>
      </div>
    `;
  }

  #coach(step) {
    return html`<div class="coach" role="status">
      <div>${step.text}</div>
      <div class="coach-row">
        <div class="steps" aria-label="Step ${this._step + 1} of ${STEPS.length}">
          ${STEPS.map((_, i) => html`<span class=${i <= this._step ? 'on' : ''}></span>`)}
        </div>
        ${step.button
          ? html`<button class="primary" @click=${this.#endTutorial}>${step.button}</button>`
          : html`<button class="skip" @click=${this.#endTutorial}>Skip tutorial</button>`}
      </div>
    </div>`;
  }

  #gameOver() {
    return html`<div class="overlay">
      <div class="panel" role="dialog" aria-label="Game over">
        <h2>Board full</h2>
        <div class="sub">Final score</div>
        <div class="big">${this.game.score}</div>
        ${this._newBest
          ? html`<span class="badge">New best</span>`
          : html`<div class="sub">Best ${this._best}</div>`}
        <div class="sub">Level ${this.game.level} · ${this.#timed ? 'Timed' : 'Endless'}</div>
        <button class="primary" @click=${() => this.#newGame(this.game.size, true)}>Play again</button>
      </div>
    </div>`;
  }

  #changed() {
    this._revision++;
  }

  // ---- tutorial ----

  #startStep(index) {
    const step = STEPS[index];
    this.timer.stop();
    if (index === 0) this.game.reset(TUTORIAL_SIZE);
    if (step.board) this.game.place(step.board);
    this._step = index;
    this._preview = null;
    this.#changed();
  }

  #advance(event) {
    const step = this.#tutorial;
    if (!step || step.until !== event) return;
    const next = this._step + 1;
    setTimeout(() => this._step === next - 1 && this.#startStep(next), event === 'score' ? 900 : 350);
  }

  #endTutorial() {
    store.set('tutorial', 'done');
    this._step = -1;
    this.#newGame(5, true);
  }

  // ---- game flow ----

  /** Drop in a new number and restart the turn timer (or end the game). */
  #nextTurn() {
    if (this.#tutorial) return;
    if (this.game.spawn() < 0) {
      this.timer.stop();
      this._newBest = this.game.score > this._best;
      if (this._newBest) {
        this._best = this.game.score;
        store.set(`best-${this._mode}`, String(this._best));
      }
      sound.play('gameover');
    } else {
      sound.play('newnumber');
      this.#startTimer();
    }
    this.#changed();
  }

  #onDrop(e) {
    const { from, to } = e.detail;
    const step = this.#tutorial;
    if (step && !step.allow.some(([f, t]) => f === from && t === to)) return;
    const cellRect = this.renderRoot.querySelector('p21-board').cellRect(to);
    const result = this.game.drop(from, to);
    if (!result) return;
    if (result.kind === 'score') {
      sound.play('point');
      this.#flyScore(cellRect, result.points, result.chain);
      if (result.levelUp) {
        sound.play('levelchanged');
        this.#banner(`Level ${this.game.level}`);
      }
    }
    if (step) {
      this.#changed();
      this.#advance(result.kind);
      return;
    }
    this.#nextTurn();
  }

  #onTap(e) {
    if (this.game.pending?.index === e.detail.index && this.game.cycle()) {
      this.#changed();
      this.#advance('cycle');
    }
  }

  #togglePlay() {
    if (this.game.over || this.#tutorial || !this.#timed) return;
    const t = this.timer;
    if (!t.started) t.start(levelTime(this.game.level));
    else if (t.running) {
      t.pause();
      sound.play('pausestate');
    } else t.resume();
  }

  #newGame(size, autostart) {
    if (this.#tutorial) {
      store.set('tutorial', 'done');
      this._step = -1;
    }
    this.game.reset(size);
    this._preview = null;
    this._newBest = false;
    if (autostart) {
      this.#startTimer();
      sound.play('gamestart');
    } else {
      this.timer.stop();
    }
    this.#changed();
  }

  /** Switching mode starts a fresh game in that mode. */
  #setMode(e) {
    this._mode = e.detail.mode;
    store.set('mode', this._mode);
    this._best = this.#loadBest();
    this.#newGame(this.game.size, true);
  }

  #toggleSound() {
    sound.setEnabled(!sound.enabled);
    this._sound = sound.enabled;
  }

  // ---- effects ----

  #reducedMotion() {
    return matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** Float "+points" and the winning expression from the cell up to the score. */
  async #flyScore(from, points, chain) {
    await this.updateComplete;
    const to = this.renderRoot.querySelector('p21-info').scoreRect();
    if (!from || !to || this.#reducedMotion()) return;
    const el = document.createElement('div');
    el.className = 'fly';
    el.innerHTML = '<b></b><span></span>';
    el.querySelector('b').textContent = `+${points}`;
    el.querySelector('span').textContent = chain;
    this.renderRoot.append(el);
    const x = from.left + from.width / 2 - el.offsetWidth / 2;
    const y = from.top + from.height / 2 - el.offsetHeight / 2;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    const dx = to.left + to.width / 2 - el.offsetWidth / 2 - x;
    const dy = to.top - y;
    await el
      .animate(
        [
          { transform: 'translate(0, 0) scale(0.6)', opacity: 0 },
          { transform: 'translate(0, -24px) scale(1.15)', opacity: 1, offset: 0.25 },
          { transform: 'translate(0, -24px) scale(1)', opacity: 1, offset: 0.5 },
          { transform: `translate(${dx}px, ${dy}px) scale(0.5)`, opacity: 0 },
        ],
        { duration: 1300, easing: 'ease-in-out' },
      )
      .finished.catch(() => {});
    el.remove();
  }

  async #banner(text) {
    if (this.#reducedMotion()) return;
    const table = this.renderRoot.querySelector('.table');
    const el = document.createElement('div');
    el.className = 'banner';
    el.textContent = text;
    table.append(el);
    await el
      .animate(
        [
          { transform: 'scale(0.4) rotate(-6deg)', opacity: 0 },
          { transform: 'scale(1.05) rotate(-3deg)', opacity: 1, offset: 0.3 },
          { transform: 'scale(1) rotate(-3deg)', opacity: 1, offset: 0.75 },
          { transform: 'scale(1.1) rotate(-3deg)', opacity: 0 },
        ],
        { duration: 1400, easing: 'ease-out' },
      )
      .finished.catch(() => {});
    el.remove();
  }
}

customElements.define('p21-app', P21App);

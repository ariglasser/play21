import { LitElement, css, html } from 'lit';
import './p21-cell.js';

const SWIPE_MS = 300;
const DRAG_THRESHOLD = 6; // px before a press becomes a drag

/**
 * The grid. Reads the Game it is given but never changes it: it reports what the
 * player did with events, and the app applies them.
 *
 * Events: p21-drop {from, to}, p21-tap {index}, p21-preview {text|null}, p21-new-game
 */
export class P21Board extends LitElement {
  static properties = {
    game: { attribute: false },
    /** Bumped by the app whenever the game changes, to trigger a render. */
    revision: { type: Number },
    _drag: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
      aspect-ratio: 1;
      container-type: inline-size;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(var(--size), 1fr);
      grid-template-rows: repeat(var(--size), 1fr);
      width: 100%;
      height: 100%;
      --tile-font: calc(100cqi / var(--size) * 0.36);
    }
    .ghost {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      pointer-events: none;
      padding: calc(100% / var(--size) * 0.1);
      box-sizing: border-box;
      width: calc(100% / var(--size));
      height: calc(100% / var(--size));
    }
    .ghost[hidden] {
      display: none;
    }
    .ghost div {
      width: 100%;
      height: 100%;
      border-radius: 18%;
      background: #616161;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-weight: 800;
      font-size: var(--tile-font);
      box-shadow: 0 6px 16px #0005;
      transform: scale(1.08);
    }
    .ghost div.expr {
      background: #2e7d32;
      font-size: calc(var(--tile-font) * 0.42);
      line-height: 1.1;
    }
    .over {
      position: absolute;
      inset: 0;
      z-index: 3;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5em;
      background: #fffd;
      border: 0;
      border-radius: inherit;
      font: inherit;
      font-size: 9cqi;
      font-weight: 800;
      cursor: pointer;
      color: #1a1a2e;
    }
    .over small {
      font-size: 0.45em;
      font-weight: 500;
    }
  `;

  /** Pointer bookkeeping that doesn't need to trigger renders. */
  #p = null;

  render() {
    const game = this.game;
    if (!game) return html``;
    const drag = this._drag;
    const pending = game.pending;
    const reach = drag ? this.#reachable(drag.from) : null;
    return html`
      <div
        class="grid"
        style="--size:${game.size}"
        @pointerdown=${this.#down}
        @pointermove=${this.#move}
        @pointerup=${this.#up}
        @pointercancel=${this.#cancel}
      >
        ${game.cells.map((cell, i) => {
          let state = '';
          if (drag?.from === i) state = 'origin';
          else if (drag && drag.over === i) state = 'over';
          else if (reach?.has(i)) state = 'reach';
          else if (!drag && pending?.index === i) state = 'pending';
          return html`<p21-cell
            .number=${cell?.n}
            .moves=${cell?.moves ?? 0}
            .cellId=${cell?.id}
            .fresh=${!!cell?.fresh}
            .state=${state}
            .label=${state === 'pending' ? `${pending.a}${pending.op}${pending.b}` : ''}
          ></p21-cell>`;
        })}
      </div>
      <div class="ghost" style="--size:${game.size}" ?hidden=${!drag}>
        <div class=${drag?.expr ? 'expr' : ''}>${drag?.label}</div>
      </div>
      ${game.over
        ? html`<button class="over" @click=${() => this.#emit('p21-new-game')}>
            Game over <small>tap to play again</small>
          </button>`
        : ''}
    `;
  }

  /** Viewport rectangle of a cell, for animations that start from the board. */
  cellRect(index) {
    return this.renderRoot.querySelectorAll('p21-cell')[index]?.getBoundingClientRect();
  }

  #reachable(from) {
    const set = new Set();
    this.game.cells.forEach((_, i) => this.game.canMove(from, i) && set.add(i));
    return set;
  }

  #emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  #metrics() {
    const rect = this.getBoundingClientRect();
    return { rect, cell: rect.width / this.game.size };
  }

  #indexAt(x, y) {
    const { rect, cell } = this.#metrics();
    const col = Math.floor((x - rect.left) / cell);
    const row = Math.floor((y - rect.top) / cell);
    const n = this.game.size;
    if (col < 0 || row < 0 || col >= n || row >= n) return -1;
    return row * n + col;
  }

  #ghost() {
    return this.renderRoot.querySelector('.ghost');
  }

  #down(e) {
    if (this.#p || this.game.over || e.button > 0) return;
    const from = this.#indexAt(e.clientX, e.clientY);
    if (from < 0 || !this.game.cells[from]) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const { cell } = this.#metrics();
    const [row, col] = this.game.rowCol(from);
    const lim = this.game.limits(from);
    const n = this.game.size;
    this.#p = {
      id: e.pointerId,
      from,
      x0: e.clientX,
      y0: e.clientY,
      t0: performance.now(),
      cell,
      row,
      col,
      // allowed offset range, in cells
      range: {
        x: [(lim.left % n) - col, (lim.right % n) - col],
        y: [Math.floor(lim.up / n) - row, Math.floor(lim.down / n) - row],
      },
      lim,
      axis: null,
      moved: false,
      offset: 0,
    };
  }

  #move(e) {
    const p = this.#p;
    if (!p || e.pointerId !== p.id) return;
    const dx = e.clientX - p.x0;
    const dy = e.clientY - p.y0;
    if (!p.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      p.moved = true;
      this.#startDrag();
    }
    // Pick the axis by the dominant direction; it can change only near the start cell.
    if (!p.axis || Math.abs(p.offset) < p.cell / 3) {
      p.axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
    }
    const [min, max] = p.range[p.axis];
    const raw = p.axis === 'x' ? dx : dy;
    p.offset = Math.min(max * p.cell, Math.max(min * p.cell, raw));
    const steps = Math.round(p.offset / p.cell);
    const over = p.axis === 'x' ? p.from + steps : p.from + steps * this.game.size;
    this.#placeGhost(p, p.axis === 'x' ? p.offset : 0, p.axis === 'y' ? p.offset : 0);
    this.#hover(over);
  }

  #up(e) {
    const p = this.#p;
    if (!p || e.pointerId !== p.id) return;
    this.#p = null;
    if (!p.moved) {
      this.#emit('p21-tap', { index: p.from });
      return;
    }
    const dx = e.clientX - p.x0;
    const dy = e.clientY - p.y0;
    const quick = performance.now() - p.t0 <= SWIPE_MS;
    if (quick && Math.hypot(dx, dy) > p.cell * 0.3) {
      // Swipe: fly all the way to the limit in that direction.
      const to =
        Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? p.lim.left : p.lim.right) : dy < 0 ? p.lim.up : p.lim.down;
      this.#finish(p, to);
      return;
    }
    this.#finish(p, this._drag?.over ?? p.from);
  }

  #cancel(e) {
    if (this.#p?.id !== e.pointerId) return;
    this.#p = null;
    this.#endDrag();
  }

  #startDrag() {
    const p = this.#p;
    this._drag = { from: p.from, over: p.from, label: this.game.cells[p.from].n, expr: false };
    this.updateComplete.then(() => this.#placeGhost(p, 0, 0));
  }

  #hover(over) {
    if (this._drag.over === over) return;
    const preview = this.game.preview(this._drag.from, over);
    const merging = over !== this._drag.from && !!this.game.cells[over];
    this._drag = { ...this._drag, over, label: merging ? preview.text : preview.value, expr: merging };
    this.#emit('p21-preview', { text: preview.text });
  }

  #placeGhost(p, dx, dy) {
    const x = p.col * p.cell + dx;
    const y = p.row * p.cell + dy;
    this.#ghost().style.transform = `translate(${x}px, ${y}px)`;
  }

  async #finish(p, to) {
    if (to === p.from || !this.game.canMove(p.from, to)) {
      this.#endDrag();
      return;
    }
    // Slide the ghost to the target cell, then report the drop.
    const [row, col] = this.game.rowCol(to);
    const ghost = this.#ghost();
    const anim = ghost.animate([{ transform: `translate(${col * p.cell}px, ${row * p.cell}px)` }], {
      duration: 120,
      easing: 'ease-out',
      fill: 'forwards',
    });
    await anim.finished.catch(() => {});
    anim.cancel();
    this.#endDrag();
    this.#emit('p21-drop', { from: p.from, to });
  }

  #endDrag() {
    this._drag = null;
    this.#emit('p21-preview', { text: null });
  }
}

customElements.define('p21-board', P21Board);

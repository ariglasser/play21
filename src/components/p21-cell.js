import { LitElement, css, html, nothing } from 'lit';

const MAX_DOTS = 6;

/** One square of the board: an empty felt slot or a number tile. Purely presentational. */
export class P21Cell extends LitElement {
  static properties = {
    number: { type: Number },
    /** How many moves are in this tile's history — shown as red dots. Fewer moves score more. */
    moves: { type: Number },
    /** '' | 'origin' (being dragged) | 'over' (drop target) | 'reach' | 'pending' (tap to change operator) | 'hint' */
    state: { type: String, reflect: true },
    /** Small expression shown on a pending tile, e.g. "9+8". */
    label: { type: String },
    cellId: { type: Number },
    fresh: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      padding: 7%;
      box-sizing: border-box;
      min-width: 0;
      position: relative;
    }
    .slot,
    .tile {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-radius: 16%;
    }
    .slot {
      background: var(--felt-deep);
      box-shadow: inset 0 2px 5px #0007;
      transition: background-color 120ms, box-shadow 120ms;
    }
    :host([state='reach']) .slot {
      background: color-mix(in srgb, var(--felt-line) 55%, var(--felt-deep));
      box-shadow: inset 0 0 0 2px var(--felt-line);
    }
    :host([state='over']) .slot {
      box-shadow: inset 0 0 0 3px var(--gold);
    }
    :host([state='origin']) .slot {
      box-shadow: inset 0 0 0 2px var(--felt-line);
      outline: 2px dashed var(--chalk-dim);
      outline-offset: -6px;
    }
    .tile {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(180deg, #fffdf6, var(--card));
      color: var(--ink);
      font-family: var(--font-display);
      font-size: var(--tile-font, 2rem);
      line-height: 1;
      box-shadow:
        0 0.35em 0 -0.05em var(--card-edge),
        0 0.5em 0.6em -0.1em #0007;
      transition: transform 140ms, box-shadow 140ms;
    }
    :host([state='over']) .tile {
      transform: translateY(-4%) scale(1.05);
      box-shadow:
        0 0 0 3px var(--gold),
        0 0.35em 0 -0.05em var(--card-edge),
        0 0.6em 0.8em -0.1em #0008;
    }
    :host([state='hint']) .tile {
      animation: nudge 1.4s ease-in-out infinite;
    }
    @keyframes nudge {
      0%,
      100% {
        box-shadow:
          0 0 0 0 var(--gold),
          0 0.35em 0 -0.05em var(--card-edge),
          0 0.5em 0.6em -0.1em #0007;
      }
      50% {
        box-shadow:
          0 0 0 4px var(--gold),
          0 0.35em 0 -0.05em var(--card-edge),
          0 0.5em 0.6em -0.1em #0007;
      }
    }
    :host([state='pending']) .tile {
      background: linear-gradient(180deg, #ffd77a, var(--gold));
      box-shadow:
        0 0.35em 0 -0.05em var(--gold-deep),
        0 0.5em 0.6em -0.1em #0007;
      cursor: pointer;
    }
    .label {
      font-family: var(--font-body);
      font-weight: 800;
      font-size: 0.34em;
      margin-bottom: 0.15em;
      opacity: 0.8;
    }
    .tap {
      position: absolute;
      top: -0.35em;
      right: -0.35em;
      display: grid;
      place-items: center;
      width: 0.75em;
      height: 0.75em;
      border-radius: 50%;
      background: var(--ink);
      color: var(--gold);
      font-family: var(--font-body);
      font-size: 0.42em;
      font-weight: 800;
      box-shadow: 0 2px 4px #0006;
    }
    .dots {
      position: absolute;
      bottom: 11%;
      display: flex;
      gap: 0.06em;
    }
    .dot {
      width: 0.11em;
      height: 0.11em;
      border-radius: 50%;
      background: var(--red);
    }
    @media (prefers-reduced-motion: reduce) {
      :host([state='hint']) .tile {
        animation: none;
        box-shadow: 0 0 0 4px var(--gold);
      }
    }
  `;

  updated(changed) {
    if (!changed.has('cellId') || !this.cellId) return;
    const tile = this.renderRoot.querySelector('.tile');
    if (!tile || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // New numbers drop in; merged tiles get a little bump.
    const frames = this.fresh
      ? [{ transform: 'translateY(-30%) scale(0.4)', opacity: 0 }, { transform: 'none', opacity: 1 }]
      : [{ transform: 'scale(1.18)' }, { transform: 'none' }];
    tile.animate(frames, { duration: 260, easing: 'cubic-bezier(.3,1.5,.6,1)' });
  }

  render() {
    if (!this.number || this.state === 'origin') return html`<div class="slot"></div>`;
    const dots = Math.min(MAX_DOTS, this.moves ?? 0);
    const pending = this.state === 'pending';
    return html`<div class="tile">
      ${pending && this.label ? html`<span class="label">${this.label}</span>` : nothing}
      ${this.number}
      ${pending ? html`<span class="tap" aria-hidden="true">↻</span>` : nothing}
      ${!pending && dots
        ? html`<span class="dots" aria-label="${this.moves} moves">
            ${Array.from({ length: dots }, () => html`<span class="dot"></span>`)}
          </span>`
        : nothing}
    </div>`;
  }
}

customElements.define('p21-cell', P21Cell);

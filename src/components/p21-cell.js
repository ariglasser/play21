import { LitElement, css, html, nothing } from 'lit';

// Fresh numbers are deep purple; every move/merge in a tile's history lightens it.
const COLORS = [
  '#6200EA', '#0D47A1', '#1565C0', '#1976D2', '#1E88E5',
  '#2196F3', '#42A5F5', '#64B5F6', '#90CAF9', '#B39DDB',
];

/** One square of the board. Purely presentational. */
export class P21Cell extends LitElement {
  static properties = {
    number: { type: Number },
    moves: { type: Number },
    /** '' | 'origin' (being dragged) | 'over' (drop target) | 'reach' | 'pending' (tap to change operator) */
    state: { type: String, reflect: true },
    /** Small expression shown on a pending cell, e.g. "9+8". */
    label: { type: String },
    cellId: { type: Number },
    fresh: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      padding: 10%;
      box-sizing: border-box;
      min-width: 0;
    }
    .tile {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-radius: 18%;
      border: 1px solid #0003;
      background: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: var(--tile-font, 2rem);
      line-height: 1;
      color: white;
      transition: background-color 150ms, transform 150ms, box-shadow 150ms;
    }
    .tile.light {
      color: #1a1a2e;
    }
    .tile.empty {
      background: #fafafa;
    }
    :host([state='origin']) .tile {
      background: #fafafa;
      color: transparent;
      border-style: dashed;
    }
    :host([state='reach']) .tile.empty {
      background: #ede7f6;
    }
    :host([state='over']) .tile {
      transform: scale(1.06);
      box-shadow: 0 0 0 3px #00c853;
    }
    :host([state='pending']) .tile {
      background: #2e7d32;
      color: white;
      cursor: pointer;
    }
    .label {
      font-size: 0.4em;
      font-weight: 600;
      opacity: 0.85;
      margin-bottom: 0.1em;
    }
  `;

  updated(changed) {
    // Pop in newly spawned numbers.
    if (changed.has('cellId') && this.fresh && this.number) {
      this.renderRoot
        .querySelector('.tile')
        .animate([{ transform: 'scale(0.3)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], {
          duration: 220,
          easing: 'cubic-bezier(.3,1.6,.6,1)',
        });
    }
  }

  render() {
    const empty = !this.number;
    const shade = Math.min(COLORS.length - 1, this.moves ?? 0);
    return html`<div
      class="tile ${empty ? 'empty' : ''} ${shade >= 6 ? 'light' : ''}"
      style=${empty || this.state === 'pending' || this.state === 'origin' ? '' : `background:${COLORS[shade]}`}
    >
      ${this.state === 'pending' && this.label ? html`<span class="label">${this.label}</span>` : nothing}
      ${empty ? '' : this.number}
    </div>`;
  }
}

customElements.define('p21-cell', P21Cell);

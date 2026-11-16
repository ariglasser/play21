// Pure game rules for Play 21. No DOM, no Lit — everything here is unit-testable.

export const TARGET = 21;
export const OPS = ['+', '-', '×', '÷'];
const START_NUMBERS = 5;
const GOALS_PER_LEVEL = 5;

/** Result of `a op b`, or undefined when the operation isn't allowed. */
export function evaluate(a, b, op) {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a === b ? undefined : Math.abs(a - b);
    case '×':
      return a * b;
    case '÷': {
      const hi = Math.max(a, b);
      const lo = Math.min(a, b);
      return hi % lo === 0 ? hi / lo : undefined;
    }
  }
}

/** The operator whose result is closest to 21 (first one wins a tie). */
export function bestOp(a, b) {
  let best;
  for (const op of OPS) {
    const value = evaluate(a, b, op);
    if (value === undefined) continue;
    if (!best || Math.abs(TARGET - value) < Math.abs(TARGET - best.value)) {
      best = { op, value };
    }
  }
  return best;
}

/** The next valid operator after `op`, wrapping around. */
export function nextOp(a, b, op) {
  const start = OPS.indexOf(op);
  for (let i = 1; i <= OPS.length; i++) {
    const candidate = OPS[(start + i) % OPS.length];
    const value = evaluate(a, b, candidate);
    if (value !== undefined) return { op: candidate, value };
  }
}

/** Expression text such as "7+5" — larger operand first for - and ÷. */
function expression(a, b, op) {
  const [l, r] = op === '-' || op === '÷' ? [Math.max(a, b), Math.min(a, b)] : [a, b];
  return `${l}${op}${r}`;
}

/** A chain is a number or { l, op, r }; render it like "((7+5)×2)". */
export function chainText(chain) {
  if (typeof chain === 'number') return String(chain);
  return `(${chainText(chain.l)}${chain.op}${chainText(chain.r)})`;
}

function chainNode(originChain, targetChain, a, b, op) {
  const swap = (op === '-' || op === '÷') && b > a;
  return swap ? { l: targetChain, op, r: originChain } : { l: originChain, op, r: targetChain };
}

/** Points for making 21: fewer moves in the chain are worth more. */
export function pointsFor(moves) {
  return 5 * Math.max(1, 12 - moves);
}

/** How long (ms) before a new number drops in, at a given level. */
export function levelTime(level) {
  return Math.max((11 - level) * 1000, 100);
}

export class Game {
  constructor(size = 5, rng = Math.random) {
    this.rng = rng;
    this.reset(size);
  }

  reset(size = this.size) {
    this.size = size;
    this.seq ??= 0; // gives every tile an id so the view can animate new ones
    /** @type {Array<null | { n: number, moves: number, chain: any }>} */
    this.cells = Array(size * size).fill(null);
    this.score = 0;
    this.level = 1;
    /** 21s made this level; five of them level you up. */
    this.goal = 0;
    this.over = false;
    /** The last merge, while its operator can still be changed with a tap. */
    this.pending = null;
    this.lastText = '';
    this.next = this.#roll();
    for (let i = 0; i < START_NUMBERS; i++) this.spawn();
  }

  rowCol(i) {
    return [Math.floor(i / this.size), i % this.size];
  }

  index(row, col) {
    return row * this.size + col;
  }

  #roll() {
    return Math.floor(this.rng() * 10) + 1;
  }

  /** Replace the board with hand-placed numbers, e.g. [[index, number], ...] (used by the tutorial). */
  place(numbers) {
    this.cells = this.cells.map(() => null);
    for (const [i, n] of numbers) this.cells[i] = { id: ++this.seq, n, moves: 0, chain: n, fresh: true };
    this.pending = null;
    this.over = false;
    this.lastText = '';
  }

  /** Empty cells left on the board. */
  get free() {
    return this.cells.filter((c) => !c).length;
  }

  /** Put the `next` number (1–10) in a random empty cell. Returns its index, or -1 (game over). */
  spawn() {
    const empty = [];
    this.cells.forEach((c, i) => c || empty.push(i));
    if (empty.length === 0) {
      this.over = true;
      this.pending = null;
      return -1;
    }
    const i = empty[Math.floor(this.rng() * empty.length)];
    const n = this.next;
    this.next = this.#roll();
    this.cells[i] = { id: ++this.seq, n, moves: 0, chain: n, fresh: true };
    return i;
  }

  /**
   * Furthest reachable index in each direction from `from`. A number can slide
   * over empty cells and stop on (merge with) the first number in its way.
   */
  limits(from) {
    const [row, col] = this.rowCol(from);
    const walk = (dr, dc) => {
      let r = row;
      let c = col;
      while (true) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= this.size || nc >= this.size) break;
        r = nr;
        c = nc;
        if (this.cells[this.index(r, c)]) break;
      }
      return this.index(r, c);
    };
    return { left: walk(0, -1), right: walk(0, 1), up: walk(-1, 0), down: walk(1, 0) };
  }

  canMove(from, to) {
    if (from === to || !this.cells[from] || this.over) return false;
    const [fr, fc] = this.rowCol(from);
    const [tr, tc] = this.rowCol(to);
    const lim = this.limits(from);
    const [, minC] = this.rowCol(lim.left);
    const [, maxC] = this.rowCol(lim.right);
    const [minR] = this.rowCol(lim.up);
    const [maxR] = this.rowCol(lim.down);
    if (fr === tr) return tc >= minC && tc <= maxC;
    if (fc === tc) return tr >= minR && tr <= maxR;
    return false;
  }

  /** What dropping `from` on `to` would produce, without changing anything. */
  preview(from, to) {
    const origin = this.cells[from];
    if (!origin) return null;
    const target = to === undefined || to === from ? null : this.cells[to];
    if (!target) return { value: origin.n, text: String(origin.n) };
    const { op, value } = bestOp(origin.n, target.n);
    const points = value === TARGET ? pointsFor(origin.moves + target.moves + 1) : 0;
    return { op, value, points, text: `${expression(origin.n, target.n, op)} = ${value}` };
  }

  /**
   * Move or merge `from` onto `to`.
   * Returns { kind: 'move' | 'merge' | 'score', points, chain, levelUp } or null if not allowed.
   */
  drop(from, to) {
    if (!this.canMove(from, to)) return null;
    const origin = this.cells[from];
    const target = this.cells[to];
    this.cells[from] = null;
    this.pending = null;

    if (!target) {
      this.cells[to] = { ...origin, moves: origin.moves + 1, fresh: false };
      this.lastText = String(origin.n);
      return { kind: 'move' };
    }

    const { op, value } = bestOp(origin.n, target.n);
    const moves = target.moves + origin.moves + 1;
    const chain = chainNode(origin.chain, target.chain, origin.n, target.n, op);
    this.lastText = `${expression(origin.n, target.n, op)} = ${value}`;

    if (value === TARGET) {
      this.cells[to] = null;
      const points = pointsFor(moves);
      const levelUp = this.addPoints(points);
      return { kind: 'score', points, chain: chainText(chain), levelUp };
    }

    this.cells[to] = { id: ++this.seq, n: value, moves, chain };
    this.pending = { index: to, a: origin.n, b: target.n, op, originChain: origin.chain, targetChain: target.chain };
    return { kind: 'merge' };
  }

  /** Tap on the last merged cell: switch it to the next valid operator. */
  cycle() {
    const p = this.pending;
    if (!p || this.over) return false;
    const next = nextOp(p.a, p.b, p.op);
    if (!next || next.op === p.op) return false;
    const cell = this.cells[p.index];
    p.op = next.op;
    cell.n = next.value;
    cell.chain = chainNode(p.originChain, p.targetChain, p.a, p.b, next.op);
    this.lastText = `${expression(p.a, p.b, next.op)} = ${next.value}`;
    return true;
  }

  /** Add points for a 21; every 21 fills a goal dot. Returns true on level up. */
  addPoints(points) {
    this.score += points;
    this.goal++;
    if (this.goal >= GOALS_PER_LEVEL) {
      this.goal = 0;
      this.level++;
      return true;
    }
    return false;
  }
}

import { describe, expect, it } from 'vitest';
import { Game, bestOp, chainText, evaluate, levelTime, nextOp, pointsFor } from '../src/game.js';

/** A game with a hand-placed board: one string per row, numbers or "." separated by spaces. */
function board(rows) {
  const g = new Game(rows.length, () => 0);
  g.cells = [];
  for (const row of rows) {
    for (const token of row.split(' ')) {
      g.cells.push(token === '.' ? null : { n: Number(token), moves: 0, chain: Number(token) });
    }
  }
  return g;
}

describe('arithmetic', () => {
  it('evaluates the four operators', () => {
    expect(evaluate(7, 3, '+')).toBe(10);
    expect(evaluate(3, 7, '-')).toBe(4);
    expect(evaluate(4, 4, '-')).toBeUndefined();
    expect(evaluate(3, 7, '×')).toBe(21);
    expect(evaluate(2, 8, '÷')).toBe(4);
    expect(evaluate(3, 8, '÷')).toBeUndefined();
  });

  it('picks the operator closest to 21', () => {
    expect(bestOp(3, 7)).toEqual({ op: '×', value: 21 });
    expect(bestOp(10, 9)).toEqual({ op: '+', value: 19 });
    expect(bestOp(10, 10)).toEqual({ op: '+', value: 20 });
  });

  it('cycles to the next valid operator', () => {
    expect(nextOp(4, 4, '+')).toEqual({ op: '×', value: 16 }); // skips 4-4
    expect(nextOp(3, 8, '×')).toEqual({ op: '+', value: 11 }); // skips 8÷3
  });

  it('scores and times', () => {
    expect(pointsFor(1)).toBe(55);
    expect(pointsFor(20)).toBe(5);
    expect(levelTime(1)).toBe(10000);
    expect(levelTime(30)).toBe(100);
  });

  it('renders chains', () => {
    expect(chainText({ l: { l: 7, op: '+', r: 5 }, op: '-', r: 2 })).toBe('((7+5)-2)');
  });
});

describe('Game', () => {
  it('starts with five numbers', () => {
    const g = new Game(5);
    expect(g.cells.filter(Boolean)).toHaveLength(5);
    expect(g.cells.every((c) => !c || (c.n >= 1 && c.n <= 10))).toBe(true);
  });

  it('slides until the first number in the way', () => {
    const g = board([
      '. . . .',
      '4 . 2 .',
      '. . . .',
      '. . 9 .',
    ]);
    const from = g.index(1, 2);
    expect(g.limits(from)).toEqual({
      left: g.index(1, 0),
      right: g.index(1, 3),
      up: g.index(0, 2),
      down: g.index(3, 2),
    });
    expect(g.canMove(from, g.index(1, 1))).toBe(true);
    expect(g.canMove(from, g.index(1, 0))).toBe(true); // merge with 4
    expect(g.canMove(from, g.index(0, 0))).toBe(false); // diagonal
  });

  it('cannot jump over a number', () => {
    const g = board(['1 2 . .', '. . . .', '. . . .', '. . . .']);
    expect(g.canMove(0, 2)).toBe(false);
    expect(g.canMove(0, 1)).toBe(true);
  });

  it('moves into an empty cell and counts the move', () => {
    const g = board(['5 . . .', '. . . .', '. . . .', '. . . .']);
    expect(g.drop(0, 3)).toEqual({ kind: 'move' });
    expect(g.cells[0]).toBeNull();
    expect(g.cells[3]).toMatchObject({ n: 5, moves: 1 });
  });

  it('merges with the best operator and lets a tap change it', () => {
    const g = board(['9 8 . .', '. . . .', '. . . .', '. . . .']);
    expect(g.drop(0, 1)).toEqual({ kind: 'merge' });
    expect(g.cells[1]).toMatchObject({ n: 17, moves: 1 });
    expect(g.lastText).toBe('9+8 = 17');

    expect(g.cycle()).toBe(true);
    expect(g.cells[1].n).toBe(1);
    expect(chainText(g.cells[1].chain)).toBe('(9-8)');

    g.cycle(); // ×
    expect(g.cells[1].n).toBe(72);
    g.cycle(); // ÷ invalid → +
    expect(g.cells[1].n).toBe(17);
  });

  it('clears the cell and scores on 21', () => {
    const g = board(['3 7 . .', '. . . .', '. . . .', '. . . .']);
    const result = g.drop(0, 1);
    expect(result).toMatchObject({ kind: 'score', points: 55, chain: '(3×7)' });
    expect(g.cells[1]).toBeNull();
    expect(g.score).toBe(55);
  });

  it('long chains fill goal dots and level up', () => {
    const g = new Game(4, () => 0);
    for (let i = 0; i < 4; i++) expect(g.addPoints(10)).toBe(false);
    expect(g.goal).toBe(5);
    expect(g.addPoints(10)).toBe(true);
    expect(g.level).toBe(2);
    expect(g.goal).toBe(1);
    expect(g.addPoints(55)).toBe(false); // a quick 21 gives points, not a goal dot
    expect(g.goal).toBe(1);
  });

  it('is over when a number cannot be placed', () => {
    const g = board(['1 2', '3 4']);
    expect(g.spawn()).toBe(-1);
    expect(g.over).toBe(true);
    expect(g.drop(0, 1)).toBeNull();
  });
});

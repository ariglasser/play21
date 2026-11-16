// The first-game walkthrough. Indexes are for the 5×5 board (row * 5 + col).
// `allow` lists the only drops accepted during a step; `until` is what finishes it.

export const TUTORIAL_SIZE = 5;

export const STEPS = [
  {
    board: [
      [11, 3],
      [13, 7],
    ],
    hints: [11, 13],
    allow: [[11, 13]],
    until: 'score',
    text: 'Drag the 3 along its row onto the 7.',
  },
  {
    board: [
      [11, 9],
      [13, 8],
    ],
    hints: [11, 13],
    allow: [[11, 13]],
    until: 'merge',
    text: 'Now drop the 9 on the 8. The operator closest to 21 is picked for you.',
  },
  {
    hints: [],
    allow: [],
    until: 'cycle',
    text: '9 + 8 is only 17. Tap the gold tile to switch the operator.',
  },
  {
    board: [
      [5, 4],
      [7, 3],
      [22, 9],
    ],
    hints: [5, 7, 22],
    allow: [
      [5, 7],
      [22, 7],
    ],
    until: 'score',
    text: 'Build up to 21: put the 4 on the 3, then slide the 9 up its column onto the result.',
  },
  {
    hints: [],
    allow: [],
    until: 'button',
    button: 'Start playing',
    text: 'Red dots count moves; fewer moves score more. A new number drops after every move, and in Timed mode also when the timer runs out. Prefer no clock? Pick Endless. Keep the board from filling up!',
  },
];

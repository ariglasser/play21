# Play 21

Slide numbers along a row or column and combine them to make **21**.

- Drag a number over empty cells; it stops on the first number in its way and merges with it.
- The operator (`+ - × ÷`) closest to 21 is picked for you. Tap the green cell to try the next one.
- Making 21 clears the cell and scores — fewer moves in the chain score more.
- A new number drops in after every move, and whenever the timer runs out. The game ends when the board is full.

Built with [Lit](https://lit.dev) web components and [Vite](https://vite.dev).

## Develop

```sh
npm install
npm run dev      # dev server at http://localhost:5173
npm test         # game-rule unit tests (Vitest)
npm run build    # production build in dist/
npm run preview  # serve the build
```

## Layout

| Path | What |
|---|---|
| `src/game.js` | All game rules — no DOM, fully unit-tested |
| `src/timer.js` | Turn timer (Lit reactive controller) |
| `src/sound.js` | Sound effects; on/off is remembered |
| `src/components/p21-app.js` | Owns the game, wires everything together |
| `src/components/p21-board.js` | Grid + pointer drag/swipe handling |
| `src/components/p21-cell.js` | One tile |
| `src/components/p21-info.js` | Toolbar, level, score, timer, current expression |
| `public/media/` | Sound files |
| `test/` | Vitest tests |

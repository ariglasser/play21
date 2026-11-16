# Play 21

Slide numbers along a row or column and combine them to make **21**.

- Drag a number over empty cells; it stops on the first number in its way and merges with it.
- The operator (`+ - × ÷`) closest to 21 is picked for you. Tap the green cell to try the next one.
- Making 21 clears the cell and scores. Red dots on a tile count its moves; fewer moves score more.
- Every 21 fills a level dot; five of them take you to the next, faster level.
- A new number (shown under **Next**) drops in after every move and whenever the timer runs out. The game ends when the board is full.
- First launch runs a short tutorial; replay it with the **?** button. Your best score is kept on the device.

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
| `src/store.js` | Safe localStorage wrapper (best score, settings) |
| `src/tutorial.js` | Tutorial steps |
| `src/theme.css` | Colour and font tokens shared by all components |
| `src/components/p21-app.js` | Owns the game, wires everything together |
| `src/components/p21-board.js` | Grid + pointer drag/swipe handling |
| `src/components/p21-cell.js` | One tile |
| `src/components/p21-info.js` | Toolbar, level, score, timer, current expression |
| `public/media/` | Sound files |
| `test/` | Vitest tests |

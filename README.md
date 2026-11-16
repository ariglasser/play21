# Play 21

Slide numbers along a row or column and combine them to make **21**.

- Drag a number over empty cells; it stops on the first number in its way and merges with it.
- The operator (`+ - × ÷`) closest to 21 is picked for you. Tap the green cell to try the next one.
- Making 21 clears the cell and scores. Red dots on a tile count its moves; fewer moves score more.
- Every 21 fills a level dot; five of them take you to the next, faster level.
- A new number drops in after every move. In **Timed** mode one also drops whenever the timer runs out; **Endless** mode has no timer. The game ends when the board is full.
- First launch runs a short tutorial; replay it with the **?** button. Your best score is kept on the device, per mode.

Built with [Lit](https://lit.dev) web components and [Vite](https://vite.dev). It's an installable PWA
that works offline.

**Play:** https://ariglasser.github.io/play21/

## Develop

```sh
npm install
npm run dev      # dev server at http://localhost:5173
npm test         # game-rule unit tests (Vitest)
npm run build    # production build in dist/
npm run preview  # serve the build
```

## Deploy

Every push to `master` runs the tests, builds, and deploys to GitHub Pages
(`.github/workflows/deploy.yml`). One-time setup: repo **Settings → Pages → Source: GitHub Actions**.
You can also run the workflow by hand from the **Actions** tab.

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
| `public/icons/` | App icons (home screen, favicon) |
| `vite.config.js` | Build + PWA manifest and offline caching |
| `test/` | Vitest tests |

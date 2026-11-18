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

**Play:** https://play21-d1797.firebaseapp.com/

## Develop

```sh
npm install
npm run dev      # dev server at http://localhost:5173
npm test         # game-rule unit tests (Vitest)
npm run build    # production build in dist/
npm run preview  # serve the build
```

## Deploy

The game is hosted on Firebase Hosting (project `play21-d1797`). Every push to `master` runs the
tests, builds, and deploys `dist/` (`.github/workflows/firebase-deploy.yml`). You can also run the
workflow by hand from the **Actions** tab.

One-time setup — give GitHub a Firebase deploy key, either way:

- **Easiest:** on your computer run `npx firebase-tools login` then
  `npx firebase-tools init hosting:github`, pick this repo, and answer **No** to overwriting
  `firebase.json` and to creating a workflow. It creates the key and saves it as the
  `FIREBASE_SERVICE_ACCOUNT_PLAY21_D1797` repository secret for you.
- **By hand:** Google Cloud console → IAM → Service accounts → create one with the
  *Firebase Hosting Admin* role → Keys → Add key (JSON). Paste the whole JSON into
  GitHub → Settings → Secrets and variables → Actions → New repository secret named
  `FIREBASE_SERVICE_ACCOUNT_PLAY21_D1797`.

Manual deploy from your computer: `npm run build && npx firebase-tools deploy --only hosting`.

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
| `firebase.json` | Firebase Hosting config (serves `dist/`, cache headers) |
| `test/` | Vitest tests |

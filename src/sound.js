// Small sound helper. Files live in /public/media and are resolved against the
// app's base URL, so the game also works when hosted under a sub-path.
import { store } from './store.js';

const NAMES = ['newnumber', 'point', 'gameover', 'gamestart', 'levelchanged', 'pausestate'];
const cache = new Map();

function load(name) {
  if (!cache.has(name)) {
    const audio = new Audio(`${import.meta.env.BASE_URL}media/${name}.wav`);
    audio.preload = 'auto';
    cache.set(name, audio);
  }
  return cache.get(name);
}

export const sound = {
  enabled: store.get('sound') === 'on',

  setEnabled(on) {
    this.enabled = on;
    store.set('sound', on ? 'on' : 'off');
    if (on) NAMES.forEach(load);
  },

  play(name) {
    if (!this.enabled) return;
    const audio = load(name);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  },
};

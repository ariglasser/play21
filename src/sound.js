// Small sound helper. Files live in /public/media and are resolved against the
// app's base URL, so the game also works when hosted under a sub-path.
const NAMES = ['newnumber', 'point', 'gameover', 'gamestart', 'levelchanged', 'pausestate'];
const STORAGE_KEY = 'p21-sound';
const cache = new Map();

function load(name) {
  if (!cache.has(name)) {
    const audio = new Audio(`${import.meta.env.BASE_URL}media/${name}.wav`);
    audio.preload = 'auto';
    cache.set(name, audio);
  }
  return cache.get(name);
}

function readSetting() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
}

export const sound = {
  enabled: readSetting(),

  setEnabled(on) {
    this.enabled = on;
    try {
      localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
    } catch {
      // Storage can be unavailable (private mode); the setting just won't persist.
    }
    if (on) NAMES.forEach(load);
  },

  play(name) {
    if (!this.enabled) return;
    const audio = load(name);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  },
};

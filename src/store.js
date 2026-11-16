// Per-device settings (best score, sound, tutorial seen). Storage can be missing
// or blocked (private mode, sandboxed frames), so every access is guarded.
const PREFIX = 'p21-';

export const store = {
  get(key) {
    try {
      return localStorage.getItem(PREFIX + key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, value);
    } catch {
      // Not persisted; the game still works.
    }
  },
};

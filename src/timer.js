/**
 * Turn timer as a Lit reactive controller. Logic runs on a setTimeout with
 * timestamps (so pause/resume is exact); the visual bar is a CSS animation that
 * the view pauses/resumes with `running` and restarts whenever `turn` changes.
 */
export class TurnTimer {
  running = false;
  duration = 0;
  turn = 0;
  #remaining = 0;
  #endsAt = 0;
  #handle;

  constructor(host, onTimeout) {
    this.host = host;
    this.onTimeout = onTimeout;
    host.addController(this);
  }

  get started() {
    return this.duration > 0;
  }

  start(duration) {
    this.#clear();
    this.turn++;
    this.duration = this.#remaining = duration;
    this.resume();
  }

  resume() {
    if (this.running || !this.started) return;
    this.running = true;
    this.#endsAt = performance.now() + this.#remaining;
    this.#handle = setTimeout(() => this.#fire(), this.#remaining);
    this.host.requestUpdate();
  }

  pause() {
    if (!this.running) return;
    this.#clear();
    this.#remaining = Math.max(0, this.#endsAt - performance.now());
    this.host.requestUpdate();
  }

  stop() {
    this.#clear();
    this.duration = this.#remaining = 0;
    this.turn++;
    this.host.requestUpdate();
  }

  hostDisconnected() {
    this.#clear();
  }

  #fire() {
    this.running = false;
    this.#remaining = 0;
    this.onTimeout();
  }

  #clear() {
    clearTimeout(this.#handle);
    this.running = false;
  }
}

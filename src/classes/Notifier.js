export default class Notifier {
  constructor(delay = 30000) {
    this.delay = delay;
  }

  #TIMER = undefined;

  start(callback) {
    this.stop();
    this.#TIMER = setInterval(() => callback(), this.delay);
  }

  stop() {
    clearTimeout(this.#TIMER);
    this.#TIMER = undefined;
  }
}

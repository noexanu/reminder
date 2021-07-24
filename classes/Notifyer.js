export default class Notifyer {
  constructor(delay) {
    this.delay = delay;
  }

  #CALLBACK = undefined;

  #TIMER = undefined;

  start(callback = this.#CALLBACK) {
    this.stop();
    this.#CALLBACK = callback;
    this.#TIMER = setInterval(() => this.#CALLBACK(), this.delay);
  }

  stop() {
    clearTimeout(this.#TIMER);
    this.#TIMER = undefined;
  }
}

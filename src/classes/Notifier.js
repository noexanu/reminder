export default class Notifier {
  /**
   * Summary. (use period)
   *
   * Description. (use period)
   *
   * @access public
   *
   * @param {number} [delay = 30000] Notifications chek period
   */
  constructor(delay = 30000) {
    this.delay = delay;
  }

  // Contains an inner timer object
  #TIMER = undefined;

  /**
   * Starts notifier check cicle
   *
   * @param {function} callback Callback function
   */
  start(callback) {
    this.stop();
    this.#TIMER = setInterval(() => callback(), this.delay);
  }

  stop() {
    clearTimeout(this.#TIMER);
    this.#TIMER = undefined;
  }
}

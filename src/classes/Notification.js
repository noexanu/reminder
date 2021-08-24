export default class Notification {
  /**
   * Summary. (use period)
   *
   * Description. (use period)
   *
   * @access public
   *
   * @param {number} date             Notification date in UTC format
   * @param {string} text             Notification itself
   * @param {number} [repeat = 1]     Number of repeats
   * @param {number} [delay = 300000] Repeat delay in milliseconds
   */
  constructor(date, text, repeat = 1, delay = 300000) {
    this.date = date;
    this.text = text;
    this.repeat = repeat;
    this.delay = delay;
  }
}

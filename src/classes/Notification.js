export default class Notification {
  constructor(
    date = new Date().getTime(),
    text = 'default text',
    repeat = 1,
    delay = 'day',
  ) {
    this.date = date;
    this.text = text;
    this.repeat = repeat;
    this.delay = delay;
  }
}

export default class MinuteDelay {
  static getNewDate = ({
    year, month, day, hours, minutes,
  }) => new Date(year, month, day, hours, minutes + 1);
}

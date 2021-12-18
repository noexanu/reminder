export default class HourDelay {
  static getNewDate = ({
    year, month, day, hours, minutes,
  }) => new Date(year, month, day, hours + 1, minutes);
}

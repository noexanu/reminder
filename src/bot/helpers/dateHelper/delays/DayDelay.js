export default class DayDelay {
  static getNewDate = ({
    year, month, day, hours, minutes,
  }) => new Date(year, month, day + 1, hours, minutes);
}

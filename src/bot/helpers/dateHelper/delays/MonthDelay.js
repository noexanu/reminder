export default class MonthDelay {
  static getNewDate = ({
    year, month, day, hours, minutes,
  }) => new Date(year, month + 1, day, hours, minutes);
}

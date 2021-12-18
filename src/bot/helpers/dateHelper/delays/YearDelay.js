export default class YearDelay {
  static getNewDate = ({
    year, month, day, hours, minutes,
  }) => new Date(year + 1, month, day, hours, minutes);
}

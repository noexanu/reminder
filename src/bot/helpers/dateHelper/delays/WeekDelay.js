export default class WeekDelay {
  static getNewDate = ({
    year, month, day, hours, minutes,
  }) => new Date(year, month, day + 7, hours, minutes);
}

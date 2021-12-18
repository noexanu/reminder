import MinuteDelay from './delays/MinuteDelay.js';
import HourDelay from './delays/HourDelay.js';
import DayDelay from './delays/DayDelay.js';
import WeekDelay from './delays/WeekDelay.js';
import MonthDelay from './delays/MonthDelay.js';
import YearDelay from './delays/YearDelay.js';

export default class DateHelper {
  static #delays = [
    MinuteDelay,
    HourDelay,
    DayDelay,
    WeekDelay,
    MonthDelay,
    YearDelay,
  ];

  static getDateParameters = (date) => ({
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  })

  static getCurrentDate = () => {
    const currentDate = new Date();
    return DateHelper.getDateParameters(currentDate);
  }

  static getStartDayOfCalendarLayout = (date) => {
    const { year, month } = DateHelper.getDateParameters(date);

    const lastDayOfPreviousMonth = new Date(year, month, 0);
    const daysInPreviousMonth = lastDayOfPreviousMonth.getDate();
    const firstDayOfCurrentMonth = lastDayOfPreviousMonth.getDay();
    return daysInPreviousMonth - firstDayOfCurrentMonth + 1;
  }

  static getNextNotificationDate =
  (date, delay) => DateHelper.#delays[delay]
    .getNewDate(DateHelper.getDateParameters(date))
    .getTime();
}

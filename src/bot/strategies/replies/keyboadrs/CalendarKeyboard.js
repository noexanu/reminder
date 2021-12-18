import Keyboard from './prototype/Keyboard.js';
import DateHelper from '../../../helpers/dateHelper/DateHelper.js';
import Locale from '../../../../locale/Locale.js';

const HEADER_KEYS_AMOUNT = 6;
const HEADER_ROW_KEYS_AMOUNT = 3;

const CALENDAR_KEYS_AMOUNT = 42;
const CALENDAR_ROW_KEYS_AMOUNT = 7;

export default class CalendarKeyboard extends Keyboard {
  #createHeaderLayout(date, months) {
    const { year, month } = DateHelper.getDateParameters(date);

    // Create header keys text array
    const headerKeysText = [...Array(HEADER_KEYS_AMOUNT)]
      .map((currentValue, currentIndex) => {
        if (currentIndex % HEADER_ROW_KEYS_AMOUNT === 0) return '<'; // ['<',   ,   ]
        if (currentIndex % HEADER_ROW_KEYS_AMOUNT === 2) return '>'; // [   ,   ,'>']
        return currentIndex < HEADER_ROW_KEYS_AMOUNT ? year : months[month];
      });

    // Create header keys callback date array
    const headerKeysCallBackDate = [...Array(HEADER_KEYS_AMOUNT)]
      .map((currentValue, currentIndex) => {
        const calculatedYear = new Date(year - 1 + currentIndex, month);
        const calculatedMonth = new Date(year, month - 1 + currentIndex - 3);
        return currentIndex < HEADER_ROW_KEYS_AMOUNT ? calculatedYear : calculatedMonth;
      });

    // Create header layout
    for (let currentIndex = 0; currentIndex < HEADER_KEYS_AMOUNT; currentIndex += 1) {
      if (currentIndex % HEADER_ROW_KEYS_AMOUNT === 0) this.addNewRow();
      if (currentIndex % HEADER_ROW_KEYS_AMOUNT === 1) this.addNewKey(headerKeysText[currentIndex]);
      else {
        this.addNewKey(headerKeysText[currentIndex], {
          method: 'update',
          date: headerKeysCallBackDate[currentIndex].getTime(),
        });
      }
    }
  }

  #createCalendarLayout(date, days) {
    const {
      year,
      month,
      hours,
      minutes,
    } = DateHelper.getDateParameters(date);
    const startDayOfMonth = DateHelper.getStartDayOfCalendarLayout(date);

    // Create days of week
    this.addNewRow();
    for (let currentIndex = 0; currentIndex < CALENDAR_ROW_KEYS_AMOUNT; currentIndex += 1) {
      this.addNewKey(days[currentIndex]);
    }

    // Create calendar layout
    for (let currentIndex = 0; currentIndex < CALENDAR_KEYS_AMOUNT; currentIndex += 1) {
      if (currentIndex % CALENDAR_ROW_KEYS_AMOUNT === 0) this.addNewRow();
      const keyCallBackDate = new Date(
        year,
        month - 1,
        startDayOfMonth + currentIndex,
        hours,
        minutes,
      );
      this.addNewKey(keyCallBackDate.getDate(), {
        method: 'next',
        date: keyCallBackDate.getTime(),
      });
    }
  }

  async createLayout(date) {
    // Set current date if args are not specified
    const dateObj = new Date(date ?? Date.now());

    const { year, month, day } = DateHelper.getDateParameters(dateObj);
    const { hours, minutes } = DateHelper.getCurrentDate();
    const calculatedDate = new Date(year, month, day, hours, minutes);

    const { months, days } = await Locale.loadLanguage(this.languageCode);

    this.clearLayout();
    this.#createHeaderLayout(calculatedDate, months);
    this.#createCalendarLayout(calculatedDate, days);

    return this.layout;
  }
}

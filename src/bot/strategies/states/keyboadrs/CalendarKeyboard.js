import Keyboard from './prototype/Keyboard.js';
import Locale from '../../../../locale/Locale.js';

export default class CalendarKeyboard extends Keyboard {
  #GET_START_DAY_OF_MONTH = (year, month) => {
    const lastDayOfPreviousMonth = new Date(year, month, 0);
    const daysInPreviousMonth = lastDayOfPreviousMonth.getDate();
    const firstDayOfCurrentMonth = lastDayOfPreviousMonth.getDay();
    return daysInPreviousMonth - firstDayOfCurrentMonth + 1;
  }

  #GET_DATE_PARAMETERS = (dateObj) => ({
    year: dateObj.getFullYear(),
    month: dateObj.getMonth(),
  })

  #GET_CURRENT_TIME = () => {
    const currentTime = new Date();
    return {
      hours: currentTime.getHours(),
      minutes: currentTime.getMinutes(),
    };
  }

  createLayout(date) {
    const dateObj = date ? new Date(date) : new Date();
    const { year, month } = this.#GET_DATE_PARAMETERS(dateObj);
    const { hours, minutes } = this.#GET_CURRENT_TIME();
    const { months, days } = Locale.languages[this.languageCode];
    const startDayOfMonth = this.#GET_START_DAY_OF_MONTH(year, month);

    this.clearLayout();

    // Create header keys text array
    const headerKeysText = [...Array(6)].map((currentValue, index) => {
      if (index % 3 === 0) return '<';
      if (index % 3 === 2) return '>';
      return index < 3 ? year : months[month];
    });

    // Create header keys callback date array
    const headerKeysCallBackDate = [...Array(6)].map((currentValue, index) => {
      const calculatedYear = new Date(year - 1 + index, month);
      const calculatedMonth = new Date(year, month - 1 + index - 3);
      return index < 3 ? calculatedYear : calculatedMonth;
    });

    // Create header layout
    for (let index = 0; index < 6; index += 1) {
      if (index % 3 === 0) this.addNewRow();
      if (index % 3 === 1) this.addNewKey(headerKeysText[index]);
      else {
        this.addNewKey(headerKeysText[index], {
          sender: 'calendar',
          method: 'update',
          date: headerKeysCallBackDate[index].getTime(),
        });
      }
    }

    // Create days of week
    this.addNewRow();
    for (let index = 0; index < 7; index += 1) this.addNewKey(days[index]);

    // Create calendar layout
    for (let index = 0; index < 42; index += 1) {
      if (index % 7 === 0) this.addNewRow();
      const keyCallBackDate = new Date(
        year,
        month - 1,
        startDayOfMonth + index,
        hours,
        minutes,
      );
      this.addNewKey(keyCallBackDate.getDate(), {
        sender: 'calendar',
        method: 'next',
        date: keyCallBackDate.getTime(),
      });
    }

    return this.layout;
  }
}

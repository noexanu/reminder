import Keyboard from './Keyboard.js';

export default class Calendar extends Keyboard {
  #CREATE_HEADER(year, month) {
    const { months, days } = this.locale;

    // Create text array
    const text = [...Array(6)].map((currentValue, index) => {
      if (index % 3 === 0) return '<';
      if (index % 3 === 2) return '>';
      return index < 3 ? year : months[month];
    });

    // Create date array
    const dates = [...Array(6)].map((currentValue, index) => {
      const calculatedYear = new Date(year - 1 + index, month);
      const calculatedMonth = new Date(year, month - 1 + index - 3);
      return index < 3 ? calculatedYear : calculatedMonth;
    });

    // Create buttons
    for (let index = 0; index < 6; index += 1) {
      if (index % 3 === 0) this.createRow();
      if (index % 3 === 1) this.createKey(text[index]);
      else {
        this.createKey(text[index], {
          sender: 'calendar',
          method: 'update',
          date: dates[index].getTime(),
        });
      }
    }

    // Create days of week
    this.createRow();
    for (let index = 0; index < 7; index += 1) this.createKey(days[index]);
  }

  #CREATE_LAYOUT(year, month) {
    const daysInPreviousMonth = new Date(year, month, 0).getDate();
    const firstDayOfCurrentMonth = new Date(year, month, 0).getDay();
    const startIndex = daysInPreviousMonth - firstDayOfCurrentMonth + 1;
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();

    for (let index = 0; index < 42; index += 1) {
      if (index % 7 === 0) this.createRow();
      const date = new Date(year, month - 1, startIndex + index, hours, minutes);
      this.createKey(date.getDate(), {
        sender: 'calendar',
        method: 'next',
        date: date.getTime(),
      });
    }
  }

  create(date = new Date()) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();

    this.clear();
    this.#CREATE_HEADER(year, month);
    this.#CREATE_LAYOUT(year, month);
    return this.keys;
  }
}

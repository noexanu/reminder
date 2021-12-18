import Keyboard from './prototype/Keyboard.js';
import DateHelper from '../../../helpers/dateHelper/DateHelper.js';

const HEADER_KEYS_AMOUNT = 6;
const HEADER_ROW_KEYS_AMOUNT = 3;

const HOURS_PER_DAY = 23;
const MINUTES_PER_HOUR = 59;

export default class TimeKeyboard extends Keyboard {
  #createHeaderLayout(date) {
    const { hours, minutes } = DateHelper.getDateParameters(date);

    // Create header keys text array
    const headerKeysText = [...Array(HEADER_KEYS_AMOUNT)]
      .map((currentValue, currentIndex) => {
        if (currentIndex % HEADER_ROW_KEYS_AMOUNT === 0) return '<'; // ['<',   ,   ]
        if (currentIndex % HEADER_ROW_KEYS_AMOUNT === 2) return '>'; // [   ,   ,'>']
        if (currentIndex < HEADER_ROW_KEYS_AMOUNT) return hours > 9 ? hours : `0${hours}`;
        return minutes > 9 ? minutes : `0${minutes}`;
      });

    // Create header keys callback date array
    const headerKeysCallBackDate = [...Array(HEADER_KEYS_AMOUNT)]
      .map((currentValue, currentIndex) => {
        const maxTimeValue = currentIndex < HEADER_ROW_KEYS_AMOUNT
          ? HOURS_PER_DAY
          : MINUTES_PER_HOUR;
        const timeUnits = currentIndex < HEADER_ROW_KEYS_AMOUNT ? hours : minutes;
        const timeValue = currentIndex < HEADER_ROW_KEYS_AMOUNT
          ? timeUnits - 1 + currentIndex
          : timeUnits - 1 + currentIndex - 3;
        if (timeValue < 0) return maxTimeValue;
        if (timeValue > maxTimeValue) return 0;
        return timeValue;
      });

    // Create layout
    for (let currentIndex = 0; currentIndex < HEADER_KEYS_AMOUNT; currentIndex += 1) {
      if (currentIndex % HEADER_ROW_KEYS_AMOUNT === 0) this.addNewRow();
      if (currentIndex % HEADER_ROW_KEYS_AMOUNT === 1) this.addNewKey(headerKeysText[currentIndex]);
      else {
        this.addNewKey(headerKeysText[currentIndex], {
          method: 'update',
          date: new Date(date).setHours(
            // 1 and 4 is a row middle position indexes [   ,xxx,   ]
            headerKeysCallBackDate[currentIndex < HEADER_ROW_KEYS_AMOUNT ? currentIndex : 1],
            headerKeysCallBackDate[currentIndex < HEADER_ROW_KEYS_AMOUNT ? 4 : currentIndex],
          ),
        });
      }
    }
  }

  #createFooterLayout(date) {
    // Create confirm key
    this.addNewRow();
    this.addNewKey('next', {
      method: 'next',
      date: date.getTime(),
    });
  }

  async createLayout(date) {
    // Set current time if args are not specified
    const dateObj = new Date(date ?? Date.now());

    this.clearLayout();
    this.#createHeaderLayout(dateObj);
    this.#createFooterLayout(dateObj);

    return this.layout;
  }
}

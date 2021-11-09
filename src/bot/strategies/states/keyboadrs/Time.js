import Keyboard from './prototype/Keyboard.js';
import Locale from '../../../../locale/Locale.js';

export default class Time extends Keyboard {
  #GET_DATE_TIME = (dateObj) => ({
    hours: dateObj.getHours(),
    minutes: dateObj.getMinutes(),
  });

  createLayout(date) {
    const dateObj = new Date(date);
    const { hours, minutes } = this.#GET_DATE_TIME(dateObj);

    this.clearLayout();

    // Create keys text array
    const keysText = [...Array(6)].map((currentValue, index) => {
      if (index % 3 === 0) return '<';
      if (index % 3 === 2) return '>';
      if (index < 3) return hours > 9 ? hours : `0${hours}`;
      return minutes > 9 ? minutes : `0${minutes}`;
    });

    // Create keys callback date array
    const keysCallBackDate = [...Array(6)].map((currentValue, index) => {
      const maxValue = index < 3 ? 23 : 59;
      const units = index < 3 ? hours : minutes;
      const value = index < 3 ? units - 1 + index : units - 1 + index - 3;
      if (value < 0) return maxValue;
      if (value > maxValue) return 0;
      return value;
    });

    // Create layout
    for (let index = 0; index < 6; index += 1) {
      if (index % 3 === 0) this.addNewRow();
      if (index % 3 === 1) this.addNewKey(keysText[index]);
      else {
        this.addNewKey(keysText[index], {
          sender: 'time',
          method: 'update',
          date: dateObj.setHours(
            keysCallBackDate[index < 3 ? index : 1],
            keysCallBackDate[index < 3 ? 4 : index],
          ),
        });
      }
    }

    // Create confirm key
    this.addNewRow();
    this.addNewKey('next', {
      sender: 'time',
      method: 'next',
      date: dateObj.setHours(hours, minutes),
    });

    return this.layout;
  }
}

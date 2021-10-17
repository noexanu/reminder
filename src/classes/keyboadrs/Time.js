import Keyboard from './Keyboard.js';

export default class Time extends Keyboard {
  #CREATE(date, hours, minutes) {
    // Create text array
    const text = [...Array(6)].map((currentValue, index) => {
      if (index % 3 === 0) return '<';
      if (index % 3 === 2) return '>';
      if (index < 3) return hours > 9 ? hours : `0${hours}`;
      return minutes > 9 ? minutes : `0${minutes}`;
    });

    // Create date array
    const time = [...Array(6)].map((currentValue, index) => {
      const maxValue = index < 3 ? 23 : 59;
      const units = index < 3 ? hours : minutes;
      const value = index < 3 ? units - 1 + index : units - 1 + index - 3;
      if (value < 0) return maxValue;
      if (value > maxValue) return 0;
      return value;
    });

    // Create buttons
    for (let index = 0; index < 6; index += 1) {
      if (index % 3 === 0) this.createRow();
      if (index % 3 === 1) this.createKey(text[index]);
      else {
        date.setHours(time[index < 3 ? index : 1], time[index < 3 ? 4 : index]);
        this.createKey(text[index], {
          sender: 'time',
          method: 'update',
          date: date.getTime(),
        });
      }
    }

    // Create confirm button
    this.createRow();
    this.createKey('next', {
      sender: 'time',
      method: 'next',
      date: date.setHours(hours, minutes),
    });
  }

  create(date = new Date()) {
    const dateObj = new Date(date);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    this.clear();
    this.#CREATE(dateObj, hours, minutes);
    return this.keys;
  }
}

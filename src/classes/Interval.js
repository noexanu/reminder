import Keyboard from './Keyboard.js';

export default class Interval extends Keyboard {
  #CREATE(unit) {
    const { units } = this.locale;

    // Create text array
    const text = [...Array(3)].map((currentValue, index) => {
      if (index % 3 === 0) return '<';
      if (index % 3 === 2) return '>';
      return unit;
    });

    // Create date array
    const values = [...Array(3)].map((currentValue, index) => {
      const { length } = units;
      const value = units.indexOf(unit) - 1 + index;
      if (value < 0) return units[length - 1];
      if (value > length - 1) return units[0];
      return units[value];
    });

    // Create buttons
    for (let index = 0; index < 3; index += 1) {
      if (index % 3 === 1) this.createKey(text[index]);
      else {
        this.createKey(text[index], {
          sender: 'interval',
          method: 'update',
          delay: values[index],
        });
      }
    }

    // Create confirm button
    this.createRow();
    this.createKey('next', {
      sender: 'interval',
      method: 'next',
      delay: unit,
    });
  }

  create(unit = this.locale.units[2]) {
    this.clear();
    this.#CREATE(unit);
    return this.keys;
  }
}

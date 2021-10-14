import Keyboard from './Keyboard.js';

export default class Repeat extends Keyboard {
  #CREATE(number) {
    // Create text array
    const text = [...Array(3)].map((currentValue, index) => {
      if (index % 3 === 0) return '<';
      if (index % 3 === 2) return '>';
      return number === Infinity ? '∞' : number;
    });

    // Create date array
    const values = [...Array(3)].map((currentValue, index) => {
      const maxValue = 10;
      const minValue = 1;
      const value = number - 1 + index;
      if (value === Infinity && index % 3 === 0) return maxValue;
      if (value === Infinity && index % 3 === 2) return minValue;
      if (value > maxValue) return Infinity;
      if (value < minValue) return Infinity;
      return value;
    });

    // Create buttons
    for (let index = 0; index < 3; index += 1) {
      if (index % 3 === 1) this.createKey(text[index]);
      else {
        this.createKey(text[index], {
          sender: 'repeat',
          method: 'update',
          repeat: values[index],
        });
      }
    }

    // Create confirm button
    this.createRow();
    this.createKey('next', {
      sender: 'repeat',
      method: 'next',
      repeat: number,
    });
  }

  create(number = 1) {
    this.clear();
    this.#CREATE(number === null ? Infinity : number);
    return this.keys;
  }
}

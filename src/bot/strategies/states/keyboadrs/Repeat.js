import Keyboard from './prototype/Keyboard.js';
import Locale from '../../../../locale/Locale.js';

const DEFAULT_REPEAT_AMOUNT = 2;
const MAXIMUM_AMOUNT_OF_REPEATS = 10;
const MINIMUM_AMOUNT_OF_REPEATS = 1;

export default class Repeat extends Keyboard {
  createLayout(repeatAmount = DEFAULT_REPEAT_AMOUNT) {
    // If repeat amount === null - replace with Infinity (JSON.parse() error)
    const actualRepeatAmount = repeatAmount ?? Infinity;

    this.clearLayout();

    // Create keys text array
    const keysText = [...Array(3)].map((currentValue, index) => {
      if (index % 3 === 0) return '<';
      if (index % 3 === 2) return '>';
      if (actualRepeatAmount === Infinity) return '∞';
      return actualRepeatAmount;
    });

    // Create keys callback repeat array
    const keysCallBackRepeat = [...Array(3)].map((currentValue, index) => {
      const calculatedValue = actualRepeatAmount - 1 + index;
      if (calculatedValue === Infinity && index % 3 === 0) return MAXIMUM_AMOUNT_OF_REPEATS;
      if (calculatedValue === Infinity && index % 3 === 2) return MINIMUM_AMOUNT_OF_REPEATS;
      if (calculatedValue > MAXIMUM_AMOUNT_OF_REPEATS) return Infinity;
      if (calculatedValue < MINIMUM_AMOUNT_OF_REPEATS) return Infinity;
      return calculatedValue;
    });

    // Create layout
    for (let index = 0; index < 3; index += 1) {
      if (index % 3 === 1) this.addNewKey(keysText[index]);
      else {
        this.addNewKey(keysText[index], {
          sender: 'repeat',
          method: 'update',
          repeat: keysCallBackRepeat[index],
        });
      }
    }

    // Create confirm key
    this.addNewRow();
    this.addNewKey('next', {
      sender: 'repeat',
      method: 'next',
      repeat: actualRepeatAmount,
    });

    return this.layout;
  }
}

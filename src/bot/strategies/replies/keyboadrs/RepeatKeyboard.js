import Keyboard from './prototype/Keyboard.js';

const HEADER_KEYS_AMOUNT = 3;
const HEADER_ROW_KEYS_AMOUNT = 3;

const DEFAULT_REPEAT_AMOUNT = 2;
const MAXIMUM_AMOUNT_OF_REPEATS = 10;
const MINIMUM_AMOUNT_OF_REPEATS = 1;

export default class RepeatKeyboard extends Keyboard {
  #createHeaderLayout(repeatAmount) {
    // Create header keys text array
    const headerKeysText = [...Array(HEADER_KEYS_AMOUNT)]
      .map((currentValue, currentIndex) => {
        if (currentIndex % HEADER_ROW_KEYS_AMOUNT === 0) return '<'; // ['<',   ,   ]
        if (currentIndex % HEADER_ROW_KEYS_AMOUNT === 2) return '>'; // [   ,   ,'>']
        if (repeatAmount === 'Infinity') return '∞';
        return repeatAmount;
      });

    // Create header keys callback repeat array
    const headerKeysCallBackRepeat = [...Array(HEADER_KEYS_AMOUNT)]
      .map((currentValue, currentIndex) => {
        const calculatedValue = repeatAmount === 'Infinity'
          ? 'Infinity'
          : repeatAmount - 1 + currentIndex;
        if (calculatedValue === 'Infinity' && currentIndex % HEADER_ROW_KEYS_AMOUNT === 0) return MAXIMUM_AMOUNT_OF_REPEATS;
        if (calculatedValue === 'Infinity' && currentIndex % HEADER_ROW_KEYS_AMOUNT === 2) return MINIMUM_AMOUNT_OF_REPEATS;
        if (calculatedValue > MAXIMUM_AMOUNT_OF_REPEATS) return 'Infinity';
        if (calculatedValue < MINIMUM_AMOUNT_OF_REPEATS) return 'Infinity';
        return calculatedValue;
      });

    // Create layout
    for (let currentIndex = 0; currentIndex < HEADER_KEYS_AMOUNT; currentIndex += 1) {
      if (currentIndex % HEADER_ROW_KEYS_AMOUNT === 1) this.addNewKey(headerKeysText[currentIndex]);
      else {
        this.addNewKey(headerKeysText[currentIndex], {
          method: 'update',
          repeat: headerKeysCallBackRepeat[currentIndex],
        });
      }
    }
  }

  #createFooterLayout(repeatAmount) {
    // Create confirm key
    this
      .addNewRow()
      .addNewKey('next', {
        method: 'next',
        repeat: repeatAmount,
      });
  }

  async createLayout(repeatAmount = DEFAULT_REPEAT_AMOUNT) {
    this.clearLayout();
    this.#createHeaderLayout(repeatAmount);
    this.#createFooterLayout(repeatAmount);

    return this.layout;
  }
}

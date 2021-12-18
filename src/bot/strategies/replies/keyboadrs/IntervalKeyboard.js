import Keyboard from './prototype/Keyboard.js';
import Locale from '../../../../locale/Locale.js';

const HEADER_KEYS_AMOUNT = 3;
const HEADER_ROW_KEYS_AMOUNT = 3;

const DEFAULT_UNIT_INDEX = 2;

export default class IntervalKeyboard extends Keyboard {
  #createHeaderLayout(unitIndex, timeUnits) {
    // Create keys text array
    const headerKeysText = [...Array(HEADER_KEYS_AMOUNT)]
      .map((currentValue, currentIndex) => {
        if (currentIndex % HEADER_ROW_KEYS_AMOUNT === 0) return '<';
        if (currentIndex % HEADER_ROW_KEYS_AMOUNT === 2) return '>';
        return timeUnits[unitIndex];
      });

    // Create keys callback delay array
    const headerKeysCallBackDelay = [...Array(HEADER_KEYS_AMOUNT)]
      .map((currentValue, currentIndex) => {
        const calculatedUnitIndex = unitIndex - 1 + currentIndex;
        if (calculatedUnitIndex < 0) return timeUnits.length - 1;
        if (calculatedUnitIndex > timeUnits.length - 1) return 0;
        return calculatedUnitIndex;
      });

    // Create layout
    for (let currentIndex = 0; currentIndex < HEADER_KEYS_AMOUNT; currentIndex += 1) {
      if (currentIndex % HEADER_ROW_KEYS_AMOUNT === 1) this.addNewKey(headerKeysText[currentIndex]);
      else {
        this.addNewKey(headerKeysText[currentIndex], {
          method: 'update',
          delay: headerKeysCallBackDelay[currentIndex],
        });
      }
    }
  }

  #createFooterLayout(unitIndex) {
    // Create confirm button
    this
      .addNewRow()
      .addNewKey('next', {
        method: 'next',
        delay: unitIndex,
      });
  }

  async createLayout(unitIndex = DEFAULT_UNIT_INDEX) {
    const { timeUnits } = await Locale.loadLanguage(this.languageCode);

    this.clearLayout();
    this.#createHeaderLayout(unitIndex, timeUnits);
    this.#createFooterLayout(unitIndex);

    return this.layout;
  }
}

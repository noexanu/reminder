import Keyboard from './prototype/Keyboard.js';
import Locale from '../../../../locale/Locale.js';

const DEFAULT_UNIT_INDEX = 2;

export default class Interval extends Keyboard {
  createLayout(unitIndex = DEFAULT_UNIT_INDEX) {
    const { timeUnits } = Locale.languages[this.languageCode];

    this.clearLayout();

    // Create keys text array
    const keysText = [...Array(3)].map((currentValue, index) => {
      if (index % 3 === 0) return '<';
      if (index % 3 === 2) return '>';
      return timeUnits[unitIndex];
    });

    // Create keys callback delay array
    const keysCallBackDelay = [...Array(3)].map((currentValue, index) => {
      const calculatedUnitIndex = unitIndex - 1 + index;
      if (calculatedUnitIndex < 0) return timeUnits.length - 1;
      if (calculatedUnitIndex > timeUnits.length - 1) return 0;
      return calculatedUnitIndex;
    });

    // Create layout
    for (let index = 0; index < 3; index += 1) {
      if (index % 3 === 1) this.addNewKey(keysText[index]);
      else {
        this.addNewKey(keysText[index], {
          sender: 'interval',
          method: 'update',
          delay: keysCallBackDelay[index],
        });
      }
    }

    // Create confirm button
    this.addNewRow();
    this.addNewKey('next', {
      sender: 'interval',
      method: 'next',
      delay: unitIndex,
    });

    return this.layout;
  }
}

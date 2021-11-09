const DEFAULT_KEYBOARD_LANGUAGE = 'en';

export default class Keyboard {
  constructor(languageCode = DEFAULT_KEYBOARD_LANGUAGE) {
    this.languageCode = languageCode;
    this.layout = [];
  }

  addNewKey(text, data = {}) {
    if (this.layout.length === 0) this.addNewRow();
    this.layout[this.layout.length - 1].push({ text, callback_data: JSON.stringify(data) });
  }

  addNewRow() {
    this.layout.push([]);
  }

  clearLayout() {
    this.layout = [];
  }
}

export default class Keyboard {
  constructor(languageCode) {
    this.languageCode = languageCode;
    this.layout = [];
  }

  addNewKey(text, data = {}) {
    if (this.layout.length === 0) this.addNewRow();
    this.layout[this.layout.length - 1].push({ text, callback_data: JSON.stringify(data) });
    return this;
  }

  addNewRow() {
    this.layout.push([]);
    return this;
  }

  clearLayout() {
    this.layout = [];
    return this;
  }
}

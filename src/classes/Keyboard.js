import Locale from './Locale.js';

export default class Keyboard extends Locale {
  #KEYS = [];

  get keys() {
    return this.#KEYS;
  }

  createKey(text, data = {}) {
    try {
      this.#KEYS[this.#KEYS.length - 1].push({ text, callback_data: JSON.stringify(data) });
    } catch {
      this.createRow();
      this.#KEYS[this.#KEYS.length - 1].push({ text, callback_data: JSON.stringify(data) });
    }
  }

  createRow() {
    this.#KEYS.push([]);
  }

  clear() {
    this.#KEYS = [];
  }
}

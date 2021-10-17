import Locale from '../Locale.js';

export default class Keyboard extends Locale {
  #MARKUP;

  get keys() {
    return this.#MARKUP;
  }

  createKey(text, data = {}) {
    try {
      this.#MARKUP[this.#MARKUP.length - 1].push({ text, callback_data: JSON.stringify(data) });
    } catch {
      this.createRow();
      this.#MARKUP[this.#MARKUP.length - 1].push({ text, callback_data: JSON.stringify(data) });
    }
  }

  createRow() {
    this.#MARKUP.push([]);
  }

  clear() {
    this.#MARKUP = [];
  }
}

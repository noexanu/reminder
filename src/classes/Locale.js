import fs from 'fs';

export default class Locale {
  constructor(languageCode) {
    this.locale = Locale.#LANGUAGES[languageCode];
  }

  static #LANGUAGES;

  static loadFiles(dir = './src/locale/') {
    Locale.#LANGUAGES = fs.readdirSync(dir).reduce((json, fileName) => {
      const value = JSON.parse(fs.readFileSync(dir + fileName));
      const key = fileName.substr(0, 2);
      return { ...json, [key]: value };
    }, {});
  }
}

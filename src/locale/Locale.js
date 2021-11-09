import fs from 'fs';

export default class Locale {
  static languages;

  static loadFiles(directory = './src/locale/languages/') {
    Locale.languages = fs.readdirSync(directory).reduce((localeObj, currentFileName) => {
      const languageProperties = JSON.parse(fs.readFileSync(directory + currentFileName));
      const languageCode = currentFileName.substring(0, 2);
      return { ...localeObj, [languageCode]: languageProperties };
    }, {});
  }
}

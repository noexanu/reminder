import fs from 'fs/promises';

const DEFAULT_DIRECTORY = './src/locale/languages/';

export default class Locale {
  static async getSupportedLanguages(directory = DEFAULT_DIRECTORY) {
    const data = await fs.readdir(directory);
    return data.map((currentFileName) => currentFileName.split('.')[0]);
  }

  static async loadLanguage(languageCode, directory = DEFAULT_DIRECTORY) {
    const data = await fs.readFile(`${directory + languageCode}.json`);
    return JSON.parse(data.toString());
  }

  static async languageIsSupported(languageCode, directory = DEFAULT_DIRECTORY) {
    const supportedLanguages = await Locale.getSupportedLanguages(directory);
    return supportedLanguages.includes(languageCode);
  }

  static async getMultiLanguageCollection(languagePropertyName, directory = DEFAULT_DIRECTORY) {
    const supportedLanguages = await Locale.getSupportedLanguages(directory);

    return supportedLanguages.reduce(async (collection, currentLanguageCode) => {
      const actualCollection = await collection;
      const language = await Locale.loadLanguage(currentLanguageCode, directory);
      const languageProperty = language[languagePropertyName];

      Object.entries(languageProperty).forEach(([propertyName, propertyValue]) => {
        if (actualCollection[propertyName]) {
          actualCollection[propertyName].push(propertyValue);
        } else {
          actualCollection[propertyName] = [propertyValue];
        }
      });

      return actualCollection;
    }, {});
  }
}

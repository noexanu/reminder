import Locale from '../../locale/Locale.js';

export default class MainKeyboard {
  static getKeyboardLayout = async (languageCode) => {
    const { keyboardActions } = await Locale.loadLanguage(languageCode);
    const {
      create, remove, seeAll, settings,
    } = keyboardActions;

    const mainKeyboardLayout = [
      [create, remove],
      [seeAll, settings],
    ];

    return mainKeyboardLayout;
  }
}

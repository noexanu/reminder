import MainKeyboard from '../../keyboard/MainKeyboard.js';
import Replier from '../../services/Replier.js';
import Locale from '../../../locale/Locale.js';

export default class CreationErrorReply {
  static async reply(ctx, session) {
    const { text } = await Locale.loadLanguage(session.languageCode);

    Replier.replyWithKeyboard(
      ctx,
      text.error[Math.floor(Math.random() * (text.error.length))],
      await MainKeyboard.getKeyboardLayout(session.languageCode),
    );
  }
}

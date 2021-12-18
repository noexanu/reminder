import MainKeyboard from '../../keyboard/MainKeyboard.js';
import Replier from '../../services/Replier.js';
import Locale from '../../../locale/Locale.js';

export default class ConfirmCreationReply {
  static async reply(ctx, session) {
    const { text } = await Locale.loadLanguage(session.languageCode);

    Replier.replyWithKeyboard(
      ctx,
      text.success[Math.floor(Math.random() * (text.success.length))],
      await MainKeyboard.getKeyboardLayout(session.languageCode),
    );
  }
}

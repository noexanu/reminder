import Replier from '../../services/Replier.js';
import Locale from '../../../locale/Locale.js';

export default class InputTextReply {
  static async reply(ctx, session) {
    const { text } = await Locale.loadLanguage(session.languageCode);

    Replier.replyWithForceReply(
      ctx,
      text.inputText[Math.floor(Math.random() * (text.inputText.length))],
    );
  }
}

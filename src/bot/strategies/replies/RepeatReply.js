import ContextHelper from '../../helpers/contextHelper/ContextHelper.js';
import Replier from '../../services/Replier.js';
import Locale from '../../../locale/Locale.js';

import Repeat from './keyboadrs/RepeatKeyboard.js';

export default class RepeatReply {
  static async reply(ctx, session) {
    const { repeat } = ContextHelper.getButtonCallBackData(ctx);
    const { text } = await Locale.loadLanguage(session.languageCode);

    const methodProperties = [
      ctx,
      text.repeat[Math.floor(Math.random() * (text.repeat.length))],
      await new Repeat(session.languageCode).createLayout(repeat),
    ];

    if (ContextHelper.isCallBack(ctx)) {
      Replier.editMessage(...methodProperties);
    } else {
      Replier.replyWithInlineKeyboard(...methodProperties);
    }
  }

  static async update(ctx, session) {
    const { repeat } = ContextHelper.getButtonCallBackData(ctx);

    Replier.editInlineKeyboard(
      ctx,
      await new Repeat(session.languageCode).createLayout(repeat),
    );
  }
}

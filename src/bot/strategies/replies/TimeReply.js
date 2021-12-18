import ContextHelper from '../../helpers/contextHelper/ContextHelper.js';
import Replier from '../../services/Replier.js';
import Locale from '../../../locale/Locale.js';

import Time from './keyboadrs/TimeKeyboard.js';

export default class TimeReply {
  static async reply(ctx, session) {
    const { date } = ContextHelper.getButtonCallBackData(ctx);
    const { text } = await Locale.loadLanguage(session.languageCode);

    Replier.replyWithInlineKeyboard(
      ctx,
      text.time[Math.floor(Math.random() * (text.time.length))],
      await new Time(session.languageCode).createLayout(date),
    );
  }

  static async update(ctx, session) {
    const { date } = ContextHelper.getButtonCallBackData(ctx);

    Replier.editInlineKeyboard(
      ctx,
      await new Time(session.languageCode).createLayout(date),
    );
  }
}

import ContextHelper from '../../helpers/contextHelper/ContextHelper.js';
import Replier from '../../services/Replier.js';
import Locale from '../../../locale/Locale.js';

import Calendar from './keyboadrs/CalendarKeyboard.js';

export default class CalendarReply {
  static async reply(ctx, session) {
    const { text } = await Locale.loadLanguage(session.languageCode);

    Replier.replyWithInlineKeyboard(
      ctx,
      text.calendar[Math.floor(Math.random() * (text.calendar.length))],
      await new Calendar(session.languageCode).createLayout(),
    );
  }

  static async update(ctx, session) {
    const { date } = ContextHelper.getButtonCallBackData(ctx);

    Replier.editInlineKeyboard(
      ctx,
      await new Calendar(session.languageCode).createLayout(date),
    );
  }
}

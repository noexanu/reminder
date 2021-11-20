import ContextHelper from '../../ContextHelper.js';
import Calendar from './keyboadrs/CalendarKeyboard.js';

export default class CalendarReply {
  static reply(ctx, session) {
    ContextHelper.replyWithInlineKeyboard(ctx, 'choose date', new Calendar(session.language).createLayout());
  }

  static update(ctx, session) {
    const { date } = ContextHelper.parseData(ctx);
    ContextHelper.editInlineKeyboard(ctx, new Calendar(session.language).createLayout(date));
  }
}

import ContextHelper from '../../ContextHelper.js';
import Time from './keyboadrs/TimeKeyboard.js';

export default class TimeReply {
  static reply(ctx, session) {
    const { date } = ContextHelper.parseData(ctx);
    ContextHelper.replyWithInlineKeyboard(ctx, 'choose time', new Time(session.language).createLayout(date));
  }

  static update(ctx, session) {
    const { date } = ContextHelper.parseData(ctx);
    ContextHelper.editInlineKeyboard(ctx, new Time(session.language).createLayout(date));
  }
}

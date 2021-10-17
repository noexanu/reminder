import UIProto from '../UIProto.js';
import Calendar from '../keyboadrs/Calendar.js';

export default class CalendarReply extends UIProto {
  reply(ctx, session) {
    this.replyWithInlineKeyboard(ctx, 'some text', new Calendar(session.language).create());
  }

  update(ctx, session) {
    const data = JSON.parse(ctx.update.callback_query.data);
    this.editInlineKeyboard(ctx, new Calendar(session.language).create(data.date));
  }
}

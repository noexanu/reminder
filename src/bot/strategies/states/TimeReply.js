import UIProto from './UIProto.js';
import Time from './keyboadrs/Time.js';

export default class TimeReply extends UIProto {
  reply(ctx, session) {
    const data = JSON.parse(ctx.update.callback_query.data);
    this.replyWithInlineKeyboard(ctx, 'some text', new Time(session.language).createLayout(data.date));
  }

  update(ctx, session) {
    const data = JSON.parse(ctx.update.callback_query.data);
    this.editInlineKeyboard(ctx, new Time(session.language).createLayout(data.date));
  }
}

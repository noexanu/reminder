import UIProto from '../UIProto.js';
import Interval from '../keyboadrs/Interval.js';

export default class IntervalReply extends UIProto {
  reply(ctx, session) {
    const data = JSON.parse(ctx.update.callback_query.data);
    this.editMessage(ctx, 'some text', new Interval(session.language).create(data.delay));
  }

  update(ctx, session) {
    const data = JSON.parse(ctx.update.callback_query.data);
    this.editInlineKeyboard(ctx, new Interval(session.language).create(data.delay));
  }
}

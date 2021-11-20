import ContextHelper from '../../ContextHelper.js';
import Interval from './keyboadrs/IntervalKeyboard.js';

export default class IntervalReply {
  static reply(ctx, session) {
    const { delay } = ContextHelper.parseData(ctx);
    const methodProperties = [
      ctx,
      'choose interval',
      new Interval(session.language).createLayout(delay),
    ];

    if (ContextHelper.isCallBack(ctx)) {
      ContextHelper.editMessage(...methodProperties);
    } else {
      ContextHelper.replyWithInlineKeyboard(...methodProperties);
    }
  }

  static update(ctx, session) {
    const { delay } = ContextHelper.parseData(ctx);
    ContextHelper.editInlineKeyboard(ctx, new Interval(session.language).createLayout(delay));
  }
}

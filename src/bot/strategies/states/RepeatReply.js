import ContextHelper from '../../ContextHelper.js';
import Repeat from './keyboadrs/RepeatKeyboard.js';

export default class RepeatReply {
  static reply(ctx, session) {
    const { repeat } = ContextHelper.parseData(ctx);
    const methodProperties = [
      ctx,
      'choose number of repeats',
      new Repeat(session.language).createLayout(repeat),
    ];

    if (ContextHelper.isCallBack(ctx)) {
      ContextHelper.editMessage(...methodProperties);
    } else {
      ContextHelper.replyWithInlineKeyboard(...methodProperties);
    }
  }

  static update(ctx, session) {
    const { repeat } = ContextHelper.parseData(ctx);
    ContextHelper.editInlineKeyboard(ctx, new Repeat(session.language).createLayout(repeat));
  }
}

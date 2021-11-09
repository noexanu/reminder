import UIProto from './UIProto.js';
import Repeat from './keyboadrs/Repeat.js';

export default class RepeatReply extends UIProto {
  reply(ctx, session) {
    const data = JSON.parse(ctx.update.callback_query.data);
    this.editMessage(ctx, 'some text', new Repeat(session.language).createLayout(data.repeat));
  }

  update(ctx, session) {
    const data = JSON.parse(ctx.update.callback_query.data);
    this.editInlineKeyboard(ctx, new Repeat(session.language).createLayout(data.repeat));
  }
}

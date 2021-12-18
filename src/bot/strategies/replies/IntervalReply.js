import ContextHelper from '../../helpers/contextHelper/ContextHelper.js';
import Replier from '../../services/Replier.js';
import Locale from '../../../locale/Locale.js';

import Interval from './keyboadrs/IntervalKeyboard.js';

export default class IntervalReply {
  static async reply(ctx, session) {
    const { delay } = ContextHelper.getButtonCallBackData(ctx);
    const { text } = await Locale.loadLanguage(session.languageCode);

    const methodProperties = [
      ctx,
      text.interval[Math.floor(Math.random() * (text.interval.length))],
      await new Interval(session.languageCode).createLayout(delay),
    ];

    if (ContextHelper.isCallBack(ctx)) {
      Replier.editMessage(...methodProperties);
    } else {
      Replier.replyWithInlineKeyboard(...methodProperties);
    }
  }

  static async update(ctx, session) {
    const { delay } = ContextHelper.getButtonCallBackData(ctx);

    Replier.editInlineKeyboard(
      ctx,
      await new Interval(session.languageCode).createLayout(delay),
    );
  }
}

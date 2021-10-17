import CalendarReply from '../states/CalendarReply.js';
import TimeReply from '../states/TimeReply.js';
import RepeatReply from '../states/RepeatReply.js';
import IntervalReply from '../states/IntervalReply.js';
import TextReply from '../states/TextReply.js';

export default class CreateComplex {
  #STATES = [
    new CalendarReply(),
    new TimeReply(),
    new RepeatReply(),
    new IntervalReply(),
    new TextReply(),
  ];

  #CURRENT_STATE = this.#STATES[0];

  execute = (ctx, session) => {
    const currentIndex = this.#STATES.indexOf(this.#CURRENT_STATE);
    const isMessage = !!ctx.update.message;
    const isReply = isMessage ? !!ctx.update.message.reply_to_message : false;
    const data = ctx.update.callback_query ? JSON.parse(ctx.update.callback_query.data) : {};
    try {
      if (isReply) {

      }
      if (data.method === 'update') {
        this.#CURRENT_STATE.update(ctx, session);
        return;
      }
      if (data.method === 'next') {
        this.#CURRENT_STATE = this.#STATES[currentIndex + 1];
      }
      this.#CURRENT_STATE.reply(ctx, session);
    } catch {
      ctx.reply('Упс, что то пошло не так. Попробуй начать заново');
    }
  };
}

import UI from './UI.js';

export default class CreateComplex extends UI {
  static execute = (ctx, session) => {
    const data = ctx.update.callback_query ? JSON.parse(ctx.update.callback_query.data) : {};
    const { draft } = session;

    switch (true) {
      case (data.sender === 'calendar' && data.method === 'update'):
        this.updateCalendar(ctx, session);
        break;
      case (data.sender === 'calendar' && data.method === 'next'):
        draft.date = data.date;
        this.replyWithTime(ctx, session);
        break;
      case (data.sender === 'time' && data.method === 'update'):
        this.updateTime(ctx, session);
        break;
      case (data.sender === 'time' && data.method === 'next'):
        draft.date = data.date;
        this.replyWithRepeat(ctx, session);
        break;
      case (data.sender === 'repeat' && data.method === 'update'):
        this.updateRepeat(ctx, session);
        break;
      case (data.sender === 'repeat' && data.method === 'next'):
        draft.repeat = data.repeat;
        this.replyWithInterval(ctx, session);
        break;
      case (data.sender === 'interval' && data.method === 'update'):
        this.updateInterval(ctx, session);
        break;
      case (data.sender === 'interval' && data.method === 'next'):
        draft.delay = data.delay;
        this.replyWithEnterText(ctx, session);
        break;
      default:
        this.replyWithCalendar(ctx, session);
        break;
    }
  }
}

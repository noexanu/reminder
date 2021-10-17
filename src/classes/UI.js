import UIProto from './UIProto.js';

import Calendar from './keyboadrs/Calendar.js';
import Time from './keyboadrs/Time.js';
import Repeat from './keyboadrs/Repeat.js';
import Interval from './keyboadrs/Interval.js';

export default class UI extends UIProto {
  start = (ctx) => {
    const keyboard = [
      ['Create', 'Delete'],
      ['See all', 'Settings'],
    ];
    this.replyWithKeyboard(ctx, 'some text', keyboard);
  }

  replyWithCalendar = (ctx, session) => {
    this.replyWithInlineKeyboard(ctx, 'some text', new Calendar(session.language).create());
  }

  updateCalendar = (ctx, session) => {
    const data = JSON.parse(ctx.update.callback_query.data);
    this.editInlineKeyboard(ctx, new Calendar(session.language).create(data.date));
  }

  replyWithTime = (ctx, session) => {
    const data = JSON.parse(ctx.update.callback_query.data);
    this.replyWithInlineKeyboard(ctx, 'some text', new Time(session.language).create(data.date));
  }

  updateTime = (ctx, session) => {
    const data = JSON.parse(ctx.update.callback_query.data);
    this.editInlineKeyboard(ctx, new Time(session.language).create(data.date));
  }

  replyWithRepeat = (ctx, session) => {
    this.editMessage(ctx, 'some text', new Repeat(session.language).create());
  }

  updateRepeat = (ctx, session) => {
    const data = JSON.parse(ctx.update.callback_query.data);
    this.editInlineKeyboard(ctx, new Repeat(session.language).create(data.repeat));
  }

  replyWithInterval = (ctx, session) => {
    this.editMessage(ctx, 'some text', new Interval(session.language).create());
  }

  updateInterval = (ctx, session) => {
    const data = JSON.parse(ctx.update.callback_query.data);
    this.editInlineKeyboard(ctx, new Interval(session.language).create(data.delay));
  }

  replyWithEnterText = (ctx, session) => {
    this.replyWithForceReply(ctx, 'some text');
  }
}

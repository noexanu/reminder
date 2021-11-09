import DataBase from '../../database/DataBase.js';
import ContextHelper from '../ContextHelper.js';

import CalendarReply from './states/CalendarReply.js';
import TimeReply from './states/TimeReply.js';
import RepeatReply from './states/RepeatReply.js';
import IntervalReply from './states/IntervalReply.js';
import TextReply from './states/TextReply.js';

export default class CreateComplexNotification {
  static #STRATEGY_STATES = [
    new CalendarReply(),
    new TimeReply(),
    new RepeatReply(),
    new IntervalReply(),
    new TextReply(),
  ];

  static sign = () => 'createComplex';

  static execute = (ctx, sessionObj) => {
    const session = sessionObj;
    const { currentStateIndex } = session;
    const currentState = CreateComplexNotification.#STRATEGY_STATES[currentStateIndex];
    const { sender, method, ...dataField } = ContextHelper.parseCallBackData(ctx);

    if (ContextHelper.isReply(ctx)) {
      session.notificationInDraft.text = ctx.update.message.text;
      session.addNotification(session.notificationInDraft);
      DataBase.updateSession(session);

      ctx.reply('успех');
      return;
    }

    if (method === 'update') {
      currentState.update(ctx, session);
      return;
    }

    if (method === 'next') {
      session.currentStateIndex += 1;
      Object.assign(session.notificationInDraft, dataField);
      DataBase.updateSession(session);

      const nextState = CreateComplexNotification.#STRATEGY_STATES[currentStateIndex + 1];
      nextState.reply(ctx, session);
      return;
    }

    currentState.reply(ctx, session);
  };
}

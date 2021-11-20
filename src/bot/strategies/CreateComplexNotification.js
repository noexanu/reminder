import DataBase from '../../database/DataBase.js';
import ContextHelper from '../ContextHelper.js';

import CalendarReply from './states/CalendarReply.js';
import TimeReply from './states/TimeReply.js';
import RepeatReply from './states/RepeatReply.js';
import IntervalReply from './states/IntervalReply.js';
import InputTextReply from './states/InputTextReply.js';

import ConfirmCreationReply from './states/ConfirmCreationReply.js';
import CreationErrorReply from './states/CreationErrorReply.js';

export default class CreateComplexNotification {
  static #STRATEGY_STATES = [
    CalendarReply,
    TimeReply,
    RepeatReply,
    IntervalReply,
    InputTextReply,
  ];

  static sign = () => 'createComplex';

  static execute = (ctx, session) => {
    const sessionObj = session;
    const { sender, method, ...dataField } = ContextHelper.parseData(ctx);

    if (ContextHelper.isReply(ctx)) {
      sessionObj.notificationInDraft.text = ctx.update.message.text;
      const { date } = sessionObj.notificationInDraft;

      if (date) {
        sessionObj.addNotification(sessionObj.notificationInDraft);
        DataBase.updateSession(sessionObj);
        ConfirmCreationReply.reply(ctx, session);
        return;
      }

      CreationErrorReply.reply(ctx, session);
      sessionObj.reserTemporaryData();
    }

    if (method === 'next') {
      sessionObj.currentStateIndex += 1;
      Object.assign(sessionObj.notificationInDraft, dataField);
    }

    if (method === 'back') {
      sessionObj.currentStateIndex -= 1;
    }

    DataBase.updateSession(sessionObj);
    const currentState = CreateComplexNotification
      .#STRATEGY_STATES[sessionObj.currentStateIndex];

    if (method === 'update') {
      currentState.update(ctx, sessionObj);
    } else {
      currentState.reply(ctx, sessionObj);
    }
  };
}

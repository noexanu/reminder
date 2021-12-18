import Session from '../session/Session.js';
import ContextHelper from '../helpers/contextHelper/ContextHelper.js';

import CalendarReply from './replies/CalendarReply.js';
import TimeReply from './replies/TimeReply.js';
import RepeatReply from './replies/RepeatReply.js';
import IntervalReply from './replies/IntervalReply.js';
import InputTextReply from './replies/InputTextReply.js';

import ConfirmCreationReply from './replies/ConfirmCreationReply.js';
import CreationErrorReply from './replies/CreationErrorReply.js';

export default class CreateComplexNotification {
  static #replyStates = [
    CalendarReply,
    TimeReply,
    RepeatReply,
    IntervalReply,
    InputTextReply,
  ];

  static #handleReply = (ctx, session) => {
    const sessionCopy = Object.assign(new Session(), session);
    const { notificationInDraft } = sessionCopy;

    if (notificationInDraft.date) {
      notificationInDraft.text = ctx.update.message.text;
      sessionCopy
        .addNotification(notificationInDraft)
        .updateInDataBase();
      ConfirmCreationReply.reply(ctx, sessionCopy);
    } else {
      sessionCopy
        .discardChanges()
        .updateInDataBase();
      CreationErrorReply.reply(ctx, sessionCopy);
    }
  }

  static #handleButtonCallBackMethod = (ctx, session) => {
    const sessionCopy = Object.assign(new Session(), session);
    const { notificationInDraft } = sessionCopy;
    const { method, ...dataField } = ContextHelper.getButtonCallBackData(ctx);

    if (method === 'next') {
      Object.assign(notificationInDraft, dataField);
      // Skip interval reply, if notification should be repeated once
      sessionCopy.currentStateIndex += notificationInDraft.repeat === 1 ? 2 : 1;
      sessionCopy.updateInDataBase();
    }

    if (method === 'back') {
      sessionCopy.currentStateIndex -= 1;
      sessionCopy.updateInDataBase();
    }

    if (method === 'update') {
      CreateComplexNotification
        .#replyStates[sessionCopy.currentStateIndex]
        .update(ctx, sessionCopy);
    } else {
      CreateComplexNotification
        .#replyStates[sessionCopy.currentStateIndex]
        .reply(ctx, sessionCopy);
    }
  }

  static execute = (ctx, session) => {
    const { method } = ContextHelper.getButtonCallBackData(ctx);

    if (ContextHelper.isReply(ctx)) {
      CreateComplexNotification.#handleReply(ctx, session);
    }

    // If it's a main menu button click or button callback contains method field
    if (ctx.match || method) {
      CreateComplexNotification.#handleButtonCallBackMethod(ctx, session);
    }
  };

  static sign = () => 'createComplex';
}

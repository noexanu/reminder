import { Telegraf } from 'telegraf';
import DataBase from '../database/DataBase.js';
import ContextHelper from './ContextHelper.js';
import Session from './session/Session.js';

import CreateComplexNotification from './strategies/CreateComplexNotification.js';

const strategies = [
  CreateComplexNotification,
];

const keyboard = {
  reply_markup: {
    keyboard: [
      ['Create', 'Delete'],
      ['See all', 'Settings'],
    ],
    resize_keyboard: true,
  },
};

export default class Bot extends Telegraf {
  #GET_SESSION = (ctx) => {
    const userID = ContextHelper.getUserID(ctx);
    return DataBase.getSession(userID);
  };

  #CREATE_SESSION = (ctx) => {
    const sender = ctx.update.message.from;
    const userID = sender.id;
    const language = sender.language_code;
    DataBase.createSession(new Session(userID, language));
  };

  registerListeners() {
    this.start(async (ctx) => {
      if (!(await this.#GET_SESSION(ctx))) this.#CREATE_SESSION(ctx);
      ctx.reply('some text', keyboard);
    });

    this.hears('Create', async (ctx) => {
      const session = await this.#GET_SESSION(ctx);
      session.setStrategy(CreateComplexNotification.sign());
      DataBase.updateSession(session);
      CreateComplexNotification.execute(ctx, session);
    });

    this.on(['callback_query', 'message'], async (ctx) => {
      if (ContextHelper.isCallBack(ctx)) ctx.answerCbQuery();
      const session = await this.#GET_SESSION(ctx);
      const currentStrategy = strategies.find(
        (strategy) => strategy.sign() === session.currentStrategy,
      );
      currentStrategy.execute(ctx, session);
    });
  }
}

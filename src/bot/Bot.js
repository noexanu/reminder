import { Telegraf } from 'telegraf';
import Session from './session/Session.js';
import MainKeyboard from './keyboard/MainKeyboard.js';
import ContextHelper from './helpers/contextHelper/ContextHelper.js';
import Replier from './services/Replier.js';
import Locale from '../locale/Locale.js';

import CreateComplexNotification from './strategies/CreateComplexNotification.js';

const DEFAULT_SESSION_LANGUAGE_CODE = 'en';

export default class Bot extends Telegraf {
  static #strategies = [
    CreateComplexNotification,
  ];

  static #createSession = async (ctx) => {
    const { userID, languageCode } = ContextHelper.getUserData(ctx);
    const languageCodeIsSupported = await Locale.languageIsSupported(languageCode);
    const resultLanguageCode = languageCodeIsSupported
      ? languageCode
      : DEFAULT_SESSION_LANGUAGE_CODE;
    return new Session(userID, resultLanguageCode).saveToDataBase();
  };

  static #getSession = (ctx) => {
    const { userID } = ContextHelper.getUserData(ctx);
    return Session.getSessionByUserID(userID);
  };

  async registerListeners() {
    const keyboardActionsCollection = await Locale
      .getMultiLanguageCollection('keyboardActions');

    this.start(async (ctx) => {
      const session = await Bot.#getSession(ctx) ?? await Bot.#createSession(ctx);
      const { text } = await Locale.loadLanguage(session.languageCode);
      Replier.replyWithKeyboard(
        ctx,
        text.greeting[Math.floor(Math.random() * (text.greeting.length))],
        await MainKeyboard.getKeyboardLayout(session.languageCode),
      );
    });

    this.hears(keyboardActionsCollection.create, async (ctx) => {
      const session = await Bot.#getSession(ctx);
      session
        .changeStrategy(CreateComplexNotification.sign())
        .updateInDataBase();
      CreateComplexNotification.execute(ctx, session);
    });

    this.on(['callback_query', 'message'], async (ctx) => {
      if (ContextHelper.isCallBack(ctx)) ctx.answerCbQuery();

      const session = await Bot.#getSession(ctx);
      const currentStrategy = Bot.#strategies.find(
        (strategy) => strategy.sign() === session.currentStrategy,
      );

      if (currentStrategy) currentStrategy.execute(ctx, session);
    });
  }
}

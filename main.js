import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';

import Locale from './src/classes/Locale.js';
import Session from './src/classes/Session.js';
import Notifier from './src/classes/Notifier.js';
import Notification from './src/classes/Notification.js';
import UI from './src/classes/UI.js';

import Router from './src/classes/Router.js';
import CreateComplex from './src/classes/CreateComplex.js';

Locale.loadFiles();

const config = dotenv.config().parsed;
const bot = new Telegraf(config.TOKEN);
const sessions = [];
const notifier = new Notifier();
const ui = new UI();

const router = new Router();

// Execution -  is a function, which executes on every notifier cicle
const execution = () => {
  const date = Date.now();
  sessions.forEach((session) => {
    for (let index = 0; index < session.notifications.length; index += 1) {
      const notification = session.notifications[index];
      if (notification.date > date) break;
      bot.telegram.sendMessage(session.userID, notification.text);

      // Create a new notification if it should be repeated some times
      if (notification.repeat > 1) {
        session.addNotification(
          new Notification(
            notification.date + notification.delay,
            notification.text,
            notification.repeat - 1,
            notification.delay,
          ),
        );
      }

      // Delete current notification
      session.deleteNotification(notification);

      // Notification under index value is no longer exsist
      index -= 1;
    }
  });
};

bot.start((ctx) => {
  const userID = ctx.update.message.from.id;
  const currentSession = sessions.find((session) => session.userID === userID);
  if (!currentSession) {
    const language = ctx.update.message.from.language_code ?? 'en';
    sessions.push(new Session(userID, language));
  }
  ui.start(ctx);
});

bot.hears('Create', (ctx) => {
  const userID = ctx.update.message.from.id;
  const currentSession = sessions.find((session) => session.userID === userID);
  router.setAndExecute(CreateComplex, ctx, currentSession);
});

// bot.hears('Create complex', (ctx) => {
//   // const userID = ctx.update.message.from.id;
//   // const currentSession = sessions.find((session) => session.userID === userID);
//   // ui.replyWithCalendar(ctx, currentSession);
// });

// bot.hears('Settings', (ctx) => {
//   // const userID = ctx.update.message.from.id;
//   // const currentSession = sessions.find((session) => session.userID === userID);
//   // ui.replyWithCalendar(ctx, currentSession);
// });

// bot.hears('See all', (ctx) => {
//   // const userID = ctx.update.message.from.id;
//   // const currentSession = sessions.find((session) => session.userID === userID);
//   // ui.replyWithCalendar(ctx, currentSession);
// });

// bot.hears('Delete', (ctx) => {
//   // const userID = ctx.update.message.from.id;
//   // const currentSession = sessions.find((session) => session.userID === userID);
//   // ui.replyWithCalendar(ctx, currentSession);
// });

bot.on('callback_query', async (ctx) => {
  await ctx.answerCbQuery();

  const userID = ctx.update.callback_query.from.id;
  const currentSession = sessions.find((session) => session.userID === userID);

  router.executeStrategy(ctx, currentSession);
});

bot.on('message', (ctx) => {
  const userID = ctx.update.message.from.id;
  const currentSession = sessions.find((session) => session.userID === userID);
  const { draft } = currentSession;

  const isReply = !!ctx.update.message.reply_to_message;
  if (isReply) {
    draft.text = ctx.update.message.text;
    currentSession.addNotification(draft);
    ctx.reply('prinial');
  } else {
    ctx.reply('nie jebu szo tam');
  }
});

notifier.start(execution);
bot.launch();

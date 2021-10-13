import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';

import Locale from './src/classes/Locale.js';
import Session from './src/classes/Session.js';
import Notifier from './src/classes/Notifier.js';
import Notification from './src/classes/Notification.js';
import UI from './src/classes/UI.js';

Locale.loadFiles();

const config = dotenv.config().parsed;
const bot = new Telegraf(config.TOKEN);
const sessions = [];
const notifier = new Notifier();
const ui = new UI();

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
  const language = ctx.update.message.from.language_code ?? 'en';
  if (!sessions.find((session) => session.userID === userID)) {
    sessions.push(new Session(userID, language));
  }
  ui.start(ctx);
});

bot.hears('Create', (ctx) => {
  const userID = ctx.update.message.from.id;
  const currentSession = sessions.find((session) => session.userID === userID);
  ui.replyWithCalendar(ctx, currentSession);
});

bot.on('callback_query', async (ctx) => {
  await ctx.answerCbQuery();

  const data = JSON.parse(ctx.update.callback_query.data);

  const userID = ctx.update.callback_query.from.id;
  const currentSession = sessions.find((session) => session.userID === userID);
  const { draft } = currentSession;

  switch (true) {
    case (data.sender === 'calendar' && data.method === 'update'):
      ui.updateCalendar(ctx, currentSession);
      break;
    case (data.sender === 'calendar' && data.method === 'next'):
      draft.date = data.date;
      ui.replyWithTime(ctx, currentSession);
      break;
    case (data.sender === 'time' && data.method === 'update'):
      ui.updateTime(ctx, currentSession);
      break;
    case (data.sender === 'time' && data.method === 'next'):
      draft.date = data.date;
      ui.replyWithRepeat(ctx, currentSession);
      break;
    case (data.sender === 'repeat' && data.method === 'update'):
      ui.updateRepeat(ctx, currentSession);
      break;
    case (data.sender === 'repeat' && data.method === 'next'):
      draft.repeat = data.repeat;
      ui.replyWithInterval(ctx, currentSession);
      break;
    case (data.sender === 'interval' && data.method === 'update'):
      ui.updateInterval(ctx, currentSession);
      break;
    case (data.sender === 'interval' && data.method === 'next'):
      draft.delay = data.delay;
      ui.replyWithEnterText(ctx, currentSession);
      break;
    default:
  }
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

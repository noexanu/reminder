import dotenv from 'dotenv';
import fs from 'fs';
import { Telegraf } from 'telegraf';

import Session from './src/classes/Session.js';
import Notification from './src/classes/Notification.js';
import Notifier from './src/classes/Notifier.js';

const locale = fs.readdirSync('./src/locale').reduce((json, file) => {
  const value = JSON.parse(fs.readFileSync(`./src/locale/${file}`));
  const key = file.substr(0, 2);
  return { ...json, [key]: value };
}, {});

const config = dotenv.config().parsed;
const bot = new Telegraf(config.TOKEN);
const sessions = [];
const notifier = new Notifier();

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
  if (!sessions.find((session) => session.userID === userID)) {
    sessions.push(new Session(userID));
  }
  ctx.reply('blank text', {
    reply_markup: {
      keyboard: [
        ['Create', 'Delete'],
        ['See all', 'Settings'],
      ],
      resize_keyboard: true,
    },
  });
});

// bot.hears('5', (ctx) => {
//   const userID = ctx.update.message.from.id;
//   const session = sessions.find((session) => session.userID === userID);
//   session.addNotification(new Notification(Date.now() + 10000, 'ha'));
// });

const createButton = (text, data) => ({ text, callback_data: JSON.stringify(data) });

const createCalendar = (year, month) => {
  const keyboard = [
    [
      createButton('<', {
        name: 'Previous year',
        date: new Date(year, month).getTime(),
      }),
      createButton(year, {
        name: 'Current year',
        date: new Date(year, month).getTime(),
      }),
      createButton('>', {
        name: 'Next year',
        date: new Date(year, month).getTime(),
      }),
    ],
    [
      createButton('<', {
        name: 'Previous month',
        date: new Date(year, month).getTime(),
      }),
      createButton(locale.en.months[month], {
        name: 'Current month',
        date: new Date(year, month).getTime(),
      }),
      createButton('>', {
        name: 'Next month',
        date: new Date(year, month).getTime(),
      }),
    ],
    [
      createButton('mon', { name: 'Monday' }),
      createButton('tue', { name: 'Tuesday' }),
      createButton('wed', { name: 'Wednesday' }),
      createButton('thu', { name: 'Thursday' }),
      createButton('fri', { name: 'Friday' }),
      createButton('sat', { name: 'Saturday' }),
      createButton('sun', { name: 'Sunday' }),
    ],
  ];

  // Month here is 1-indexed (January is 1, February is 2, etc). This is
  // because we're using 0 as the day so that it returns the last day
  // of the last month, so you have to add 1 to the month number
  // so it returns the correct amount of days
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 0).getDay();
  const daysInCurrentMonth = daysInMonth(year, month);
  const daysInPreviousMonth = daysInMonth(
    month > 0 ? year : year - 1,
    month > 0 ? month - 1 : 11,
  );

  const calendar = [];

  for (let day = 0; day < 42; day += 1) {
    const previousMonthDate = daysInPreviousMonth - day;
    const currentMonthDate = day - firstDayOfMonth + 1;
    const nextMonthDate = currentMonthDate - daysInCurrentMonth;
    switch (true) {
      case day < firstDayOfMonth:
        calendar.unshift(
          createButton(
            previousMonthDate,
            {
              name: 'Date',
              date: new Date(
                month > 0 ? year : year - 1,
                month > 0 ? month - 1 : 11,
                previousMonthDate,
              ).getTime(),
            },
          ),
        );
        break;
      case day < daysInCurrentMonth + firstDayOfMonth:
        calendar.push(
          createButton(
            currentMonthDate,
            {
              name: 'Date',
              date: new Date(year, month, currentMonthDate).getTime(),
            },
          ),
        );
        break;
      default:
        calendar.push(
          createButton(
            nextMonthDate,
            {
              name: 'Date',
              date: new Date(
                month < 11 ? year : year + 1,
                month < 11 ? month + 1 : 0,
                nextMonthDate,
              ).getTime(),
            },
          ),
        );
    }
  }
  while (calendar.length) keyboard.push(calendar.splice(0, 7));
  return keyboard;
};

bot.hears('Create', (ctx) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  ctx.reply('Pick a date', {
    reply_markup: {
      inline_keyboard: createCalendar(year, month),
    },
  });
});

bot.on('callback_query', async (ctx) => {
  await ctx.answerCbQuery();
  const data = JSON.parse(ctx.update.callback_query.data);
  const date = new Date(data.date);
  const year = date.getFullYear();
  const month = date.getMonth();
  switch (true) {
    case data.name === 'Next month':
      await ctx.editMessageReplyMarkup({
        inline_keyboard: createCalendar(
          month < 11 ? year : year + 1,
          month < 11 ? month + 1 : 0,
        ),
      });
      break;
    case data.name === 'Previous month':
      await ctx.editMessageReplyMarkup({
        inline_keyboard: createCalendar(
          month > 0 ? year : year - 1,
          month > 0 ? month - 1 : 11,
        ),
      });
      break;
    case data.name === 'Next year':
      await ctx.editMessageReplyMarkup({ inline_keyboard: createCalendar(year + 1, month) });
      break;
    case data.name === 'Previous year':
      await ctx.editMessageReplyMarkup({ inline_keyboard: createCalendar(year - 1, month) });
      break;
    default:
      console.log(data);
  }
});

notifier.start(execution);
bot.launch();

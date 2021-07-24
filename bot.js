import { Telegraf, Markup } from 'telegraf';
import Session from './classes/Session.js';
import Notification from './classes/Notification.js';
import Notifyer from './classes/Notifyer.js';

const token = '1726046745:AAEdw4bDsCW2VDMBP1bt5F4wgQ639AD8mIg';
const bot = new Telegraf(token);
const sessions = [];
const notifyer = new Notifyer(1000);

const execution = () => {
  const date = Date.now();
  sessions.forEach((session) => {
    for (let index = 0; index < session.notifications.length; index += 1) {
      const notification = session.notifications[index];
      if (notification.date > date) {
        break;
      }
      bot.telegram.sendMessage(session.userID, notification.text);
      // проверка на количество оставшихся уведомлений
      if (notification.repeat > 1) {
        notification.repeat -= 1;
        notification.date += 1000;
        for (let index = index; index <= session.notifications.length; index += 1) {
          if (
            notification.date < session.notifications[index].date
            || session.notifications[index] === undefined
          ) {
            session.notifications.splice(index, 0, notification);
          }
        }
        session.notifications.splice(index, 1);
      } else {
        session.notifications.splice(index, 1);
        index -= 1;
      }
    }
  });
};

bot.start((ctx) => {
  const userID = ctx.update.message.from.id;
  if (!sessions.find((session) => session.userID === userID)) {
    sessions.push(new Session(userID));
  }
});

bot.hears('5', (ctx) => {
  const userID = ctx.update.message.from.id;
  const session = sessions.find((session) => session.userID === userID);
  session.notifications.push(new Notification(Date.now() + 5000, 'ha-ha'));
});

// bot.on('message', (ctx) => {
//   const message = ctx.update.message.text;
// });

notifyer.start(execution);
bot.launch();

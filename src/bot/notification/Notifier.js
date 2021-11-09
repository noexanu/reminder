import DataBase from '../../database/DataBase.js';
import Notification from './Notification.js';

const DEFAULT_NOTIFIER_DELAY = 50 * 1000; // milliseconds

export default class Notifier {
  constructor(bot, delay = DEFAULT_NOTIFIER_DELAY) {
    this.bot = bot;
    this.delay = delay;
  }

  timer;

  notify = async () => {
    const sessions = await DataBase.getAllSessions();
    const currentDate = Date.now();

    sessions.forEach((session) => {
      session.notifications.forEach((notification) => {
        if (notification.date > currentDate) return;

        // Send notification message to user
        this.bot.telegram.sendMessage(session.userID, notification.text);

        // Create a new notification if it should be repeated some times
        if (notification.repeat > 1) {
          session.addNotification(
            new Notification(
              notification.date + 5000,
              notification.text,
              notification.repeat - 1,
              notification.delay,
            ),
          );
        }

        // Delete old notification
        session.deleteNotification(notification);
      });
      DataBase.updateSession(session);
    });
  };

  start() {
    this.stop();
    this.timer = setInterval(this.notify, this.delay);
  }

  stop() {
    clearTimeout(this.timer);
  }
}

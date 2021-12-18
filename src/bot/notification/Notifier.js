import Notification from './Notification.js';
import DateHelper from '../helpers/dateHelper/DateHelper.js';
import Session from '../session/Session.js';

const DEFAULT_NOTIFIER_DELAY = 50 * 1000; // milliseconds

export default class Notifier {
  constructor(bot, delay = DEFAULT_NOTIFIER_DELAY) {
    this.bot = bot;
    this.delay = delay;
  }

  #timerID = null;

  #notify = async () => {
    const sessions = await Session.getAllSessions();
    const currentDate = Date.now();

    sessions.forEach((session) => {
      const outOfDateNotifications = session.notifications.filter(
        (notification) => notification.date < currentDate,
      );
      outOfDateNotifications.forEach((notification) => {
        const {
          date, text, repeat, delay,
        } = notification;

        // Send notification message to user
        this.bot.telegram.sendMessage(session.userID, text);

        // Create a new notification if it should be repeated some times
        if (repeat > 1 || repeat === 'Infinity') {
          session.addNotification(
            new Notification(
              DateHelper.getNextNotificationDate(new Date(date), delay),
              text,
              repeat === 'Infinity'
                ? 'Infinity'
                : repeat - 1,
              delay,
            ),
          );
        }

        // Delete current notification
        session.deleteNotification(notification);
      });

      session.updateInDataBase();
    });
  };

  launch() {
    this.clear();
    this.#timerID = setInterval(this.#notify, this.delay);
  }

  clear() {
    clearTimeout(this.#timerID);
  }
}

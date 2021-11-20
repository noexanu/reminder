import DataBase from '../../database/DataBase.js';
import Notification from './Notification.js';

const DEFAULT_NOTIFIER_DELAY = 50 * 1000; // milliseconds

export default class Notifier {
  constructor(bot, delay = DEFAULT_NOTIFIER_DELAY) {
    this.bot = bot;
    this.delay = delay;
  }

  #TIMER;

  #GET_DATE_PARAMETERS = (dateObj) => ({
    year: dateObj.getFullYear(),
    month: dateObj.getMonth(),
    day: dateObj.getDate(),
    hours: dateObj.getHours(),
    minutes: dateObj.getMinutes(),
  });

  #GET_NEXT_DATE = (date, delay) => {
    const {
      year, month, day, hours, minutes,
    } = this.#GET_DATE_PARAMETERS(new Date(date));

    if (delay === 0) return new Date(year, month, day, hours, minutes + 1).getTime(); // Minute
    if (delay === 1) return new Date(year, month, day, hours + 1, minutes).getTime(); // Hour
    if (delay === 2) return new Date(year, month, day + 1, hours, minutes).getTime(); // Day
    if (delay === 3) return new Date(year, month, day + 7, hours, minutes).getTime(); // Week
    if (delay === 4) return new Date(year, month + 1, day, hours, minutes).getTime(); // Month
    if (delay === 5) return new Date(year + 1, month, day, hours, minutes).getTime(); // Year

    return date;
  };

  notify = async () => {
    const sessions = await DataBase.getAllSessions();
    const currentDate = Date.now();

    sessions.forEach((session) => {
      session.notifications.forEach((notification) => {
        const {
          date, text, repeat, delay,
        } = notification;

        if (date > currentDate) return;

        // Send notification message to user
        this.bot.telegram.sendMessage(session.userID, text);

        // Create a new notification if it should be repeated some times
        if (repeat > 1 || repeat === 'Infinity') {
          session.addNotification(
            new Notification(
              this.#GET_NEXT_DATE(date, delay),
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
      DataBase.updateSession(session);
    });
  };

  start() {
    this.stop();
    this.#TIMER = setInterval(this.notify, this.delay);
  }

  stop() {
    clearTimeout(this.#TIMER);
  }
}

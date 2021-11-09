import Notification from '../notification/Notification.js';

export default class Session {
  constructor(userID, language) {
    this.userID = userID;
    this.language = language;
    this.currentStrategy = undefined;
    this.currentStateIndex = 0;
    this.notificationInDraft = new Notification();
    this.notifications = [];
  }

  reserTemporaryFields() {
    this.currentStateIndex = 0;
    this.notificationInDraft = new Notification();
  }

  setStrategy(sign) {
    this.reserTemporaryFields();
    this.currentStrategy = sign;
  }

  addNotification(notification) {
    this.reserTemporaryFields();

    const largerDateNotificationIndex = this.notifications.findIndex(
      (element) => notification.date < element.date,
    );
    const insertionIndex = largerDateNotificationIndex >= 0
      ? largerDateNotificationIndex
      : this.notifications.length;
    this.notifications.splice(insertionIndex, 0, notification);
  }

  deleteNotification(notification) {
    const equalNotificationIndex = this.notifications.findIndex(
      (element) => element === notification,
    );
    this.notifications.splice(equalNotificationIndex, 1);
  }
}

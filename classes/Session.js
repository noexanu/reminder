export default class Session {
  /**
   * @param {number} userID Unique user ID
   *
   * @example new Session()
   */
  constructor(userID) {
    this.userID = userID;
    this.notifications = [];
  }

  /**
   * @param {object} notification Notification object
   *
   * @example session.addNotification(notification)
   */
  addNotification(notification) {
    const notifications = this.notifications;
    const length = notifications.length;
    if (length === 0) {
      notifications.push(notification);
    } else {
      for (let index = 0; index < length; index += 1) {
        if (notification.date < notifications[index].date) {
          notifications.splice(index, 0, notification);
          return;
        }
      }
      notifications.push(notification);
    }
  }

  /**
   * @param {object} notification Notification object
   *
   * @example session.deleteNotification(notification)
   */
  deleteNotification(notification) {
    const notifications = this.notifications;
    const string = JSON.stringify(notification);
    const index = notifications.findIndex((element) => JSON.stringify(element) === string);
    notifications.splice(index, 1);
  }
}

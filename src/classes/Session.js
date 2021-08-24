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
    if (this.notifications.length === 0) {
      this.notifications.push(notification);
    } else {
      for (let index = 0; index < this.notifications.length; index += 1) {
        if (notification.date < this.notifications[index].date) {
          this.notifications.splice(index, 0, notification);
          return;
        }
      }
      this.notifications.push(notification);
    }
  }

  /**
   * @param {object} notification Notification object
   *
   * @example session.deleteNotification(notification)
   */
  deleteNotification(notification) {
    const string = JSON.stringify(notification);
    const index = this.notifications.findIndex((element) => JSON.stringify(element) === string);
    this.notifications.splice(index, 1);
  }
}

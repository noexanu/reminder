import Notification from '../notification/Notification.js';
import DataBase from '../../database/DataBase.js';

const DEFAULT_COLLECTION_NAME = 'sessions';

export default class Session {
  constructor(userID, languageCode) {
    this.userID = userID;
    this.languageCode = languageCode;
    this.currentStrategy = null;
    this.currentStateIndex = 0;
    this.notificationInDraft = new Notification();
    this.notifications = [];
  }

  discardChanges() {
    this.currentStateIndex = 0;
    this.notificationInDraft = new Notification();
    return this;
  }

  changeStrategy(sign) {
    this.discardChanges();
    this.currentStrategy = sign;
    return this;
  }

  #calculateInsertionIndex(notification) {
    const largerDateNotificationIndex = this.notifications.findIndex(
      (element) => notification.date < element.date,
    );
    return largerDateNotificationIndex < 0
      ? this.notifications.length
      : largerDateNotificationIndex;
  }

  addNotification(notification) {
    this.discardChanges();
    const insertionIndex = this.#calculateInsertionIndex(notification);
    this.notifications.splice(insertionIndex, 0, notification);
    return this;
  }

  deleteNotification(notification) {
    const equalNotificationIndex = this.notifications.findIndex(
      (element) => element === notification,
    );
    this.notifications.splice(equalNotificationIndex, 1);
    return this;
  }

  // DataBase methods

  static #getCollection = async () => {
    const dataBase = await DataBase.getConnection();
    return dataBase.collection(DEFAULT_COLLECTION_NAME);
  }

  async saveToDataBase() {
    const collection = await Session.#getCollection();
    await collection.insertOne(this);
    return this;
  }

  async updateInDataBase() {
    const collection = await Session.#getCollection();
    await collection.updateOne(
      { userID: this.userID },
      { $set: this },
    );
    return this;
  }

  async deleteFromDataBase() {
    const collection = await Session.#getCollection();
    await collection.deleteOne({ userID: this.userID });
    return this;
  }

  static async getSessionByUserID(userID) {
    const collection = await Session.#getCollection();
    const session = await collection.findOne({ userID });
    return session ? Object.assign(new Session(), session) : undefined;
  }

  static async getAllSessions() {
    const collection = await Session.#getCollection();
    const sessions = await collection.find().toArray();
    return sessions.map((session) => Object.assign(new Session(), session));
  }
}

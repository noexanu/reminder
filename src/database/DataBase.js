import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import Session from '../bot/session/Session.js';

const config = dotenv.config().parsed;

export default class DataBase {
  static collection;

  static async connect() {
    const url = `mongodb://${config.MONGODB_IP}:${config.MONGODB_PORT}`;
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(config.MONGODB_DB_NAME);
    const collection = db.collection('sessions');
    DataBase.collection = collection;
  }

  static async createSession(sessionObj) {
    await DataBase.collection.insertOne(sessionObj);
  }

  static async updateSession(sessionObj) {
    await DataBase.collection.updateOne(
      { userID: sessionObj.userID },
      { $set: sessionObj },
    );
  }

  static async deleteSession(userID) {
    await DataBase.collection.deleteOne({ userID });
  }

  static async getSession(userID) {
    const session = await DataBase.collection.findOne({ userID });
    return session ? Object.assign(new Session(), session) : undefined;
  }

  static async getAllSessions() {
    const sessions = await DataBase.collection.find().toArray();
    return sessions.map((session) => Object.assign(new Session(), session));
  }
}

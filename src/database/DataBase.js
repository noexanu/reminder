import { MongoClient } from 'mongodb';

export default class DataBase {
  static #connection = null;

  static async connect(url, dbName) {
    const client = await new MongoClient(url).connect();
    DataBase.#connection = await client.db(dbName);
  }

  static getConnection() {
    return DataBase.#connection;
  }
}

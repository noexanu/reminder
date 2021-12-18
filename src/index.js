import dotenv from 'dotenv';
import Bot from './bot/Bot.js';
import Notifier from './bot/notification/Notifier.js';
import DataBase from './database/DataBase.js';

const config = dotenv.config().parsed;
const bot = new Bot(config.BOT_TOKEN);
const notifier = new Notifier(bot);

DataBase.connect(config.MONGODB_URL, config.MONGODB_DBNAME);

bot.registerListeners();
bot.launch();
notifier.launch();

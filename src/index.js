import dotenv from 'dotenv';
import Bot from './bot/Bot.js';
import Locale from './locale/Locale.js';
import Notifier from './bot/notification/Notifier.js';
import DataBase from './database/DataBase.js';

DataBase.connect();
Locale.loadFiles();

const config = dotenv.config().parsed;
const bot = new Bot(config.BOT_TOKEN);
const notifier = new Notifier(bot);

bot.registerListeners();
bot.launch();
notifier.start();

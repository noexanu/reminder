export default class Replier {
  static replyWithKeyboard = (ctx, text, keyboard) => {
    ctx.reply(text, {
      reply_markup: {
        keyboard,
        resize_keyboard: true,
      },
    });
  }

  static replyWithInlineKeyboard = (ctx, text, keyboard) => {
    ctx.reply(text, {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  }

  static replyWithForceReply = (ctx, text) => {
    ctx.reply(text, {
      reply_markup: {
        force_reply: true,
      },
    });
  }

  static editInlineKeyboard = (ctx, keyboard) => {
    ctx.editMessageReplyMarkup({
      inline_keyboard: keyboard,
    });
  }

  static editMessage = (ctx, text, keyboard) => {
    ctx.editMessageText(text, {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  }
}

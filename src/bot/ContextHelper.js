export default class ContextHelper {
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

  static isCallBack = (ctx) => !!ctx.update.callback_query;

  static isMessage = (ctx) => !!ctx.update.message;

  static isReply = (ctx) => ContextHelper.isMessage(ctx) && !!ctx.update.message.reply_to_message;

  static parseData = (ctx) => (ContextHelper.isCallBack(ctx)
    ? JSON.parse(ctx.update.callback_query.data)
    : {}
  );

  static getUserID = (ctx) => (ContextHelper.isCallBack(ctx)
    ? ctx.update.callback_query.from.id
    : ctx.update.message.from.id
  );
}

export default class UIProto {
  replyWithKeyboard = (ctx, text, keyboard) => {
    ctx.reply(text, {
      reply_markup: {
        keyboard,
        resize_keyboard: true,
      },
    });
  }

  replyWithInlineKeyboard = (ctx, text, keyboard) => {
    ctx.reply(text, {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  }

  replyWithForceReply = (ctx, text) => {
    ctx.reply(text, {
      reply_markup: {
        force_reply: true,
      },
    });
  }

  editInlineKeyboard = (ctx, keyboard) => {
    ctx.editMessageReplyMarkup({
      inline_keyboard: keyboard,
    });
  }

  editMessage = (ctx, text, keyboard) => {
    ctx.editMessageText(text, {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  }
}

export default class ContextHelper {
  static isCallBack = (ctx) => !!ctx.update.callback_query;

  static isMessage = (ctx) => !!ctx.update.message;

  static isReply = (ctx) => ContextHelper.isMessage(ctx) && !!ctx.update.message.reply_to_message;

  static getButtonCallBackData = (ctx) => (ContextHelper.isCallBack(ctx)
    ? JSON.parse(ctx.update.callback_query.data)
    : {}
  );

  static getUserData = (ctx) => {
    const userID = ContextHelper.isCallBack(ctx)
      ? ctx.update.callback_query.from.id
      : ctx.update.message.from.id;
    const languageCode = ContextHelper.isCallBack(ctx)
      ? ctx.update.callback_query.from.language_code
      : ctx.update.message.from.language_code;
    return { userID, languageCode };
  };
}

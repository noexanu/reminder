export default class ContextHelper {
  static isCallBack = (ctx) => !!ctx.update.callback_query;

  static isMessage = (ctx) => !!ctx.update.message;

  static isReply = (ctx) => ContextHelper.isMessage(ctx) && !!ctx.update.message.reply_to_message;

  static parseCallBackData = (ctx) => (ContextHelper.isCallBack(ctx)
    ? JSON.parse(ctx.update.callback_query.data)
    : {}
  );

  static getUserID = (ctx) => (ContextHelper.isCallBack(ctx)
    ? ctx.update.callback_query.from.id
    : ctx.update.message.from.id
  );
}

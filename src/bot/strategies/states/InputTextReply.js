import ContextHelper from '../../ContextHelper.js';

export default class InputTextReply {
  static reply(ctx, session) {
    ContextHelper.replyWithForceReply(ctx, 'send notification text');
  }
}

import UIProto from '../UIProto.js';

export default class TextReply extends UIProto {
  reply(ctx, session) {
    this.replyWithForceReply(ctx, 'some text');
  }
}

import ContextHelper from '../../ContextHelper.js';

const keyboard = [
  ['Create', 'Delete'],
  ['See all', 'Settings'],
];

export default class CreationErrorReply {
  static reply(ctx, session) {
    ContextHelper.replyWithKeyboard(ctx, 'try again', keyboard);
  }
}

import ContextHelper from '../../ContextHelper.js';

const keyboard = [
  ['Create', 'Delete'],
  ['See all', 'Settings'],
];

export default class ConfirmCreationReply {
  static reply(ctx, session) {
    ContextHelper.replyWithKeyboard(ctx, 'created', keyboard);
  }
}

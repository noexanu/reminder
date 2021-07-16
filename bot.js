const { Telegraf, Markup } = require('telegraf');
const token = '1726046745:AAEdw4bDsCW2VDMBP1bt5F4wgQ639AD8mIg';
const bot = new Telegraf(token);

//start event
bot.start(ctx => {
  ctx.reply(`Добро пожаловать! Это базовое сообщение потому что нельзя сразу отправить 2 клавиатуры. Приходится делать такие приколы. Что бы получить сообщение, нажми <Следующая новость>`, {
    reply_markup: {
      keyboard: [
        ['Главная', 'Следующая новость'],
        ['Хто я?', 'Последнее сообщение из ...'],
        ['Оставить комментарий']
      ],
      resize_keyboard: true
    }
  });
});

//keyboard events
bot.hears('Следующая новость', ctx => {
  ctx.reply('<b>Это</b> могла бы быть интересная <i>новость</i>', {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[
        { text: '👍', callback_data: 'like' },
        { text: '🙁', callback_data: 'whatever' },
        { text: '👎', callback_data: 'dislike' }
      ]]
    }
  });
});

bot.hears('Главная', ctx => 
  ctx.reply('Вы нажали кнопку <i><b>ГЛАВНАЯ</b></i>', { 
    parse_mode: 'HTML' 
  })
);

bot.hears('Хто я?', ctx => 
  ctx.reply(ctx.message)
);

bot.hears('Последнее сообщение из ...', ctx => {
  return ctx.reply(
    'Special buttons keyboard',
    Markup.keyboard([
      Markup.button.contactRequest('Send contact'),
      Markup.button.locationRequest('Send location')
    ]).resize()
  )
});

bot.hears('Оставить комментарий', ctx => 
  ctx.reply('Оставте комментарий:', {
    reply_markup: {
      force_reply: true
    }
  })
);

bot.on('message', ctx => { 
  const isReply = ctx.update.message.reply_to_message ? true : false;
  let message;
  if(isReply) {
    const reply = ctx.update.message.reply_to_message;
    const isBotReply = 
      reply.from.is_bot === true && 
      reply.from.username === 'Szaszlychok_bot' ? true : false;
    const isCommentReply = 
      reply.text === 'Оставте комментарий:' ? true : false;
    switch(true) {
      case isCommentReply:
        message = 'Спасибо за комметарий!';
        break;
      case isBotReply:
        message = 'Я принимаю комментарии только если мы заранее договорились. Можете нажать <Оставить комментарий>.';
        break;
      default:
        message = 'Я не понимаю контекста... Жду ответа на свое сообщение.';
    }
  } else {
    message = 'Упс, что то пошло не так... Поробуйте еще раз';
  }
  ctx.reply(message, {
    reply_markup: {
      keyboard: [
        ['Главная', 'Следующая новость'],
        ['Хто я?', 'Последнее сообщение из ...'],
        ['Оставить комментарий']
      ],
      resize_keyboard: true
    }
  })
})



//inline keyboard events
bot.action('like', async ctx => {
  await ctx.answerCbQuery();
  ctx.editMessageReplyMarkup({
    inline_keyboard: [[
      { text: 'GREAT!', callback_data: 'like' },
      { text: '🙁', callback_data: 'whatever' },
      { text: '👎', callback_data: 'dislike' }
    ]]
  });
  ctx.reply('Мне тоже нравится! Как вы видите, я могу менять и содержимое кнопок по нажатию');
});

bot.action('whatever', async ctx => {
  await ctx.answerCbQuery();
  ctx.editMessageReplyMarkup({
    inline_keyboard: [[
      { text: '👍', callback_data: 'like' },
      { text: 'Ah...', callback_data: 'whatever' },
      { text: '👎', callback_data: 'dislike' }
    ]]
  });
  ctx.reply('Ну да... Как вы видите, я могу менять и содержимое кнопок по нажатию');
});

bot.action('dislike', async ctx => {
  await ctx.answerCbQuery();
  ctx.editMessageReplyMarkup({
    inline_keyboard: [[
      { text: '👍', callback_data: 'like' },
      { text: '🙁', callback_data: 'whatever' },
      { text: '...', callback_data: 'dislike' }
    ]]
  });
  ctx.reply('Грустно... Как вы видите, я могу менять и содержимое кнопок по нажатию');
});



bot.launch();



// bot.on('animation', () => console.log('animation'))
// bot.on('audio', () => console.log('audio'))
// bot.on('callback_query', () => console.log('callback_query'))
// bot.on('channel_chat_created', () => console.log('channel_chat_created'))
// bot.on('channel_post', () => console.log('channel_post'))
// bot.on('chat_member', () => console.log('chat_member'))
// bot.on('chosen_inline_result', () => console.log('chosen_inline_result'))
// bot.on('connected_website', () => console.log('connected_website'))
// bot.on('contact', () => console.log('contact'))
// bot.on('delete_chat_photo', () => console.log('delete_chat_photo'))
// bot.on('dice', () => console.log('dice'))
// bot.on('document', () => console.log('document'))
// bot.on('edited_channel_post', () => console.log('edited_channel_post'))
// bot.on('edited_message', () => console.log('edited_message'))
// bot.on('forward_date', () => console.log('forward_date'))
// bot.on('game', () => console.log('game'))
// bot.on('group_chat_created', () => console.log('group_chat_created'))
// bot.on('inline_query', () => console.log('inline_query'))
// bot.on('invoice', () => console.log('invoice'))
// bot.on('left_chat_member', () => console.log('left_chat_member'))
// bot.on('location', () => console.log('location'))
// bot.on('message', () => console.log('message'))
// bot.on('message_auto_delete_timer_changed', () => console.log('message_auto_delete_timer_changed'))
// bot.on('migrate_from_chat_id', () => console.log('migrate_from_chat_id'))
// bot.on('migrate_to_chat_id', () => console.log('migrate_to_chat_id'))
// bot.on('my_chat_member', () => console.log('my_chat_member'))
// bot.on('new_chat_members', () => console.log('new_chat_members'))
// bot.on('new_chat_photo', () => console.log('new_chat_photo'))
// bot.on('new_chat_title', () => console.log('new_chat_title'))
// bot.on('passport_data', () => console.log('passport_data'))
// bot.on('photo', () => console.log('photo'))
// bot.on('pinned_message', () => console.log('pinned_message'))
// bot.on('poll', () => console.log('poll'))
// bot.on('poll_answer', () => console.log('poll_answer'))
// bot.on('pre_checkout_query', () => console.log('pre_checkout_query'))
// bot.on('proximity_alert_triggered', () => console.log('proximity_alert_triggered'))
// bot.on('shipping_query', () => console.log('shipping_query'))
// bot.on('sticker', () => console.log('sticker'))
// bot.on('successful_payment', () => console.log('successful_payment'))
// bot.on('supergroup_chat_created', () => console.log('supergroup_chat_created'))
// bot.on('text', () => console.log('text'))
// bot.on('venue', () => console.log('venue'))
// bot.on('video', () => console.log('video'))
// bot.on('video_note', () => console.log('video_note'))
// bot.on('voice', () => console.log('voice'))
// bot.on('voice_chat_ended', () => console.log('voice_chat_ended'))
// bot.on('voice_chat_participants_invited', () => console.log('voice_chat_participants_invited'))
// bot.on('voice_chat_scheduled', () => console.log('voice_chat_scheduled'))
// bot.on('voice_chat_started', () => console.log('voice_chat_started'))
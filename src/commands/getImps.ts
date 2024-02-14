import { log } from 'console';
import * as emoji from 'node-emoji';
import { Client, Message, TextChannel } from 'discord.js';

export const GetImps = (msg: Message) => {
  try {
    const imp = emoji.find(':smiling_imp:') as {
      emoji: string;
      key: string;
    };

    if (msg.content === imp?.emoji) {
      console.log('Its a smiley face');
      msg.react(imp.emoji);
    }
  } catch (error) {
    console.error(error);
  }
};

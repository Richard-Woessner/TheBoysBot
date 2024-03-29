import { Client, TextChannel } from 'discord.js';

export const SendMessage = (
  client: Client,
  channelId: string,
  message: string
) => {
  try {
    let channel = client.channels.cache.get(channelId) as TextChannel;

    channel.send(message);
  } catch (error) {
    console.error(error);
  }
};

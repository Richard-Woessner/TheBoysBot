import { configDotenv } from 'dotenv';
import { config } from './config';
import * as emoji from 'node-emoji';
import {
  Client,
  Events,
  GatewayIntentBits,
  Message,
  TextChannel
} from 'discord.js';
import { scheduleJob } from 'node-schedule';
import { Imp } from './models/Imp';
import { GetResults } from './commands/getResults';
import { randomInt } from 'crypto';

configDotenv();

let FitnessChannelId = '';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`);

  scheduleJob('0 0 18 ? * SUN *', function () {
    if (FitnessChannelId != '') {
      console.log('FitnessChannelId is not null');

      GetResults(client, FitnessChannelId);
    } else {
      console.log('FitnessChannelId is null');
    }
  });
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

client.on(Events.ShardError, (error) => {
  console.error('A websocket connection encountered an error:', error);
});

client.on('messageCreate', async (msg: Message) => {
  console.log('Message received');

  try {
    if (msg.content === 'ping') {
      var rand = randomInt(1, 5);

      console.log('Random number: ' + rand);

      let message = '';

      if (rand < 4) {
        message = 'pong';
      } else {
        message = 'L';
      }

      await msg.react(message);
    }
    // set the FitnessChannelId, needed for the !getResults command
    else if (msg.content === '!fitness') {
      FitnessChannelId = msg.channelId;
      msg.reply(`Set FitnessChannelId to ` + msg.channelId);

      let channel = client.channels.cache.get(FitnessChannelId) as TextChannel;
      //delete last message
      var message = await channel.messages.fetch({ limit: 1 });
      message.first()?.delete();
    }
    // react to the message with the Imp emoji
    else if (msg.content === Imp?.emoji) {
      console.log('Imp emoji found!');
      msg.react(Imp.emoji).catch((e) => console.log(e.message));
    }
    // get the results of the last week
    else if (msg.content === '!getResults') {
      console.log('getResults');

      if (FitnessChannelId === '') {
        console.log('FitnessChannelId is null');
        return;
      }

      GetResults(client, FitnessChannelId);
    }
  } catch (e: any) {
    console.log(e);
    console.log(e.message);
  }
});

console.log(config.DISCORD_TOKEN ?? 'DISCORD_TOKEN is null');

client.login(config.DISCORD_TOKEN); //signs the bot in with token

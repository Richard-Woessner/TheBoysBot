import { configDotenv } from 'dotenv';
import { config } from './config';
import * as emoji from 'node-emoji';
import { Client, GatewayIntentBits, Message, TextChannel } from 'discord.js';
import { scheduleJob } from 'node-schedule';
import { emojiUnicode } from './func';
import { SendMessage } from './commands/sendMessage';
import { Align, getMarkdownTable } from 'markdown-table-ts';
import { ImpRecord } from './models/Models';

configDotenv();

const imp = emoji.find(':smiling_imp:') as {
  emoji: string;
  key: string;
};

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

  //Runs every Sunday at 12:00 PM
  scheduleJob('*/0 12 * * SUN', function () {
    if (FitnessChannelId != '') {
      console.log('FitnessChannelId is not null');

      SendMessage(client, FitnessChannelId, 'Hello here!');
    } else {
      console.log('FitnessChannelId is null');
    }
  });
});

client.on('messageCreate', async (msg: Message) => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }

  if (msg.content === '!fitness') {
    FitnessChannelId = msg.channelId;
    msg.reply(`Set FitnessChannelId to ` + msg.channelId);
  }

  if (msg.content === imp?.emoji) {
    console.log('Imp emoji found!');
    msg.react(imp.emoji);
  }

  if (msg.content === '!getResults') {
    console.log('getResults');

    let channel = client.channels.cache.get(msg.channelId) as TextChannel;

    var messages = await channel.messages.fetch();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const pastWeekMessages = messages.filter(
      (msg: Message) => msg.createdAt > oneWeekAgo && msg.author.bot === false
    );

    var impRecords: ImpRecord[] = [];

    pastWeekMessages.forEach((message: Message) => {
      if (message.content.includes(imp.emoji)) {
        impRecords.push({
          userName: message.author.displayName,
          date: message.createdAt.toDateString()
        });
      }
    });

    const compareSecondColumn = (a: string[], b: string[]) => {
      if (a[1] === b[1]) {
        return 0;
      } else {
        return a[1] > b[1] ? -1 : 1;
      }
    };

    var userImpCount: string[][] = [];

    const uniqueImpRecords = impRecords.filter(
      (record, index, self) =>
        index ===
        self.findIndex(
          (r) => r.userName === record.userName && r.date === record.date
        )
    );

    var users: string[] = uniqueImpRecords.map((record) => record.userName);

    [...new Set(users)].map((user) => {
      var count = uniqueImpRecords.filter(
        (record) => record.userName === user
      ).length;

      userImpCount.push([user, count.toString()]);
    });

    const table = getMarkdownTable({
      table: {
        head: ['User', 'Imps'],
        body: userImpCount.sort(compareSecondColumn)
      },
      alignment: [Align.Left, Align.Center, Align.Right]
    });

    msg.react(imp.emoji);
    msg.reply(' ```' + table + '```');
  }
});

//this line must be at the very end
client.login(config.DISCORD_TOKEN); //signs the bot in with token

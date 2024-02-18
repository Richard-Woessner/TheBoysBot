import { Client, Message, TextChannel } from 'discord.js';
import { ImpRecord } from '../models/Models';
import { Imp } from '../models/Imp';
import { Align, getMarkdownTable } from 'markdown-table-ts';

export const GetResults = async (client: Client, FitnessChannelId: string) => {
  let channel = client.channels.cache.get(FitnessChannelId) as TextChannel;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  var messages: Message[] = [];

  var tempMessages = await channel.messages.fetch({ limit: 100 });

  tempMessages.forEach((message) => {
    messages.push(message);
  });

  while (
    messages[messages.length - 1]?.createdTimestamp! > oneWeekAgo.valueOf() &&
    messages[messages.length - 1]?.id !== '1206653049490116718'
  ) {
    console.log('Fetching more messages');
    var lastMessageId = messages[messages.length - 1]?.id;

    console.log('Last message id: ' + lastMessageId);

    tempMessages = await channel.messages.fetch({
      before: lastMessageId,
      limit: 100
    });

    tempMessages.forEach((message) => {
      messages.push(message);
    });

    console.log(messages.length);

    messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
  }

  console.log('Messages: ' + messages.length);

  const pastWeekMessages = messages.filter(
    (msg: Message) =>
      msg.createdTimestamp > oneWeekAgo.valueOf() && msg.author.bot === false
  );

  var impRecords: ImpRecord[] = [];

  pastWeekMessages.forEach((message: Message) => {
    if (message.content.includes(Imp.emoji)) {
      var record = {
        userName: message.author.displayName,
        date: message.createdAt.toDateString()
      };

      console.log(record);

      impRecords.push(record);
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

  channel.send('@here```' + table + '```');
};

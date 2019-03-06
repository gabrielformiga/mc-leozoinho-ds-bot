const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const client = new Discord.Client();
const streamOptions = { seek: 0, volume: 0.2 };

client.login(process.env.BOT_TOKEN);

const songs = {
  '!jao': 'https://www.youtube.com/watch?v=u3tYgLtePy4',
  '!brotar': 'https://www.youtube.com/watch?v=7FPq57MAOJI',
  '!saudade': 'https://www.youtube.com/watch?v=Pmj0eOopzCc',
  '!sol': 'https://www.youtube.com/watch?v=W5O-3h6g18g',
  '!cenario': 'https://www.youtube.com/watch?v=ewuTBPBrEHc',
  '!liberdade': 'https://www.youtube.com/watch?v=mzkpeARVOK0',
  '!osmir': 'https://www.youtube.com/watch?v=eX1a7sLr9T8',
  '!vida': 'https://www.youtube.com/watch?v=9yaE1KEqeig',
  '!silva': 'https://www.youtube.com/watch?v=xhaE64NY9sc',
  '!jesus': 'https://www.youtube.com/watch?v=O-2IesjW-TI',
  '!show': 'https://www.youtube.com/watch?v=2w-G87pssVg',
  '!caiara': 'https://www.youtube.com/watch?v=EyCCkTltI80',
  '!muleque': 'https://www.youtube.com/watch?v=RDL_yz6MxrU',
  '!protecao': 'https://www.youtube.com/watch?v=l0aSvVBMzDk',
  '!pv': 'https://www.youtube.com/watch?v=S0spKItTKqc',
  '!mustardinha': 'https://www.youtube.com/watch?v=hqtiuA-i42k'
};

const queues = {};

client.on('message', message => {
  if (!message.guild) return;

  if (!(message.guild.id in queues)) {
    queues[message.guild.id] = [];
  }

  if (message.content in songs) {
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => play(connection, message))
        .catch(console.log);
    } else {
      message.reply('Você deve joinar algum canal de voz do sucesso!');
    }
  } else if (message.content == '!stop') {
    if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
  } else if (message.content == '!leozoinho') {
    message.reply('Segue a lista dos comandos do sucesso:\n' +
      Object.keys(songs).map(key => key + '\n').toString().replace(/,/g, '') +
      '!stop\n'
    );
  }
});

async function play(connection, message) {
  console.log('going to play ' + message.content);

  queues[message.guild.id].push(message.content);

  const link = songs[message.content];
  const stream = ytdl(link, { filter : 'audioonly' });
  console.log('created ytdl stream');
  const dispatcher = connection.playStream(stream, streamOptions);
  console.log('playing ' + message.content);

  dispatcher.on('end', () => {
    queues[message.guild.id].shift();
    if (queues[message.guild.id].length == 0) {
      connection.disconnect();
    }
    console.log('end playing ' + message.content);
  });

  dispatcher.on('error', console.log);
}
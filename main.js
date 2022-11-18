require('dotenv').config();
const fs = require('fs');
const { Client, Intents, MessageEmbed} = require("discord.js");
const { Player } = require('discord-player');
const queue = require('./commands/queue');
const { connect } = require('http2');
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES
] });

let botId;
const prefix = process.env.PREFIX
const message = new MessageEmbed()
.setColor("#FFFFFF");

client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
})

client.once('ready', (bot) => {
    console.log(`${bot.user.tag} has gone online!`)
    botId = bot.user.id;
})

client.player.on("trackAdd", (queue, track) => {
    queue.channel.send(`Added a Track to the Queue: **${track.title}**`)
}) 

client.player.on("trackEnd", (queue, track) => {
    queue.channel.send(`A Track: **${track.title}** finished playing`)
})

client.player.on("trackStart", (queue, track) => {
    queue.channel.send(`A Track: **${track.title}** started playing in **${queue.connection.channel.name}**`)
})

client.player.on("queueEnd", (queue, track) => {
    queue.channel.send(`The Queue ended`)
})

const cmdAliases = {
    vol: "volume",
    join: "play",
    leave: "quit"
}

client.on('messageCreate', (msg) => {
    if (msg.author.id === botId) return;
    if (msg.content.startsWith(prefix)) {
        const args = msg.content.split(' ');
        const cmd = args[0].slice(1);
        args.shift();
        if (fs.existsSync(`./commands/${cmd}.js`) || fs.existsSync(`./commands/${cmdAliases[cmd]}.js`)) {
            const func = cmdAliases[cmd] ? require(`./commands/${cmdAliases[cmd]}`) : require(`./commands/${cmd}`);
            func.execute(client, msg, args);
        } else {
            message.setTitle(`Command ${cmd} doesn't exist`)
            msg.channel.send({ embeds: [message] });
        }
    }
})

client.login(process.env.TOKEN);
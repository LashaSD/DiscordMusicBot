const { QueryType } = require('discord-player');
const { MessageEmbed } = require('discord.js');

const PREFIX = process.env.PREFIX;

module.exports = {
    data: {
        name: `${PREFIX}Play`,
        description: `Plays the linked/queued Song`,
        info: 
        `
            ${PREFIX}play *<Link>*
            ${PREFIX}play search *<Keywords>*
        `
    },
    async execute(client, msg, args) {
        const message = new MessageEmbed()
        .setColor("#ffffff");
        if (!msg.member.voice.channel) {
            message.setTitle("You need to be in a voice channel!")
            return msg.channel.send({ embeds: [message] });
        }
        const queue = client.player.getQueue(msg.guild) ? client.player.getQueue(msg.guild) : await client.player.createQueue(msg.guild);
        queue.channel = msg.channel;        
        if (args.length === 0) {
            if (!queue.connection) await queue.connect(msg.member.voice.channel);
            if (queue.tracks.length === 0) {
                message.setTitle("The Queue is Empty");
                msg.channel.send({ embeds: [message] });
            } else {
                const name = queue.tracks[0].title
                await queue.play();
            }
        } else{
            let queryType = QueryType.YOUTUBE_VIDEO;
            if (args[0].toLowerCase() === "search") {
                queryType = QueryType.YOUTUBE_SEARCH;
                args.shift();
            }
            const url = args.join(' ');
            const result = await client.player.search(url, {
                requestedBy: msg.member.user,
                searchEngine: queryType
            })
            if (result.tracks.length === 0) {
                message.setTitle("No Results")
                return msg.channel.send({ embeds: [message] });
            }

            message.setTitle("Found Track!")
            msg.channel.send({ embeds: [message] })
            if (!queue.connection) await queue.connect(msg.member.voice.channel);
            
            const song = result.tracks[0];
            await queue.addTrack(song);
            await queue.play();
        }
    }
}
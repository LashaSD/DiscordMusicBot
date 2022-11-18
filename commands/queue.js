const { QueryType } = require('discord-player');
const { MessageEmbed, Message } = require('discord.js');
require('dotenv').config();

const PREFIX = process.env.PREFIX;

module.exports = {
    data: {
        name: `${PREFIX}Queue`,
        description: `Add/remove Videos to/from the Queue`,
        info: 
        `
            ${PREFIX}queue add *<Link> *
            ${PREFIX}queue add search *<Keywords>*
            ${PREFIX}queue remove *<QueueNumber>*
            ${PREFIX}queue list << **Lists the Contents of the Queue**
            ${PREFIX}queue playing << **Gives info about the currently playing Video**
            ${PREFIX}queue skip << **skips to next song**
        `
    },
    async execute(client, msg, args) {
        const message = new MessageEmbed()
        .setColor("#FFFFFF");
        let queue;
        if (client.player.getQueue(msg.guild)) {
            queue = client.player.getQueue(msg.guild)
        } else {
            queue = await client.player.createQueue(msg.guild)
        }
        queue.channel = msg.channel;
        if(args[0].toLowerCase() === 'add') {
            let queryType = QueryType.YOUTUBE_VIDEO;
            args.shift();
            if (args[0].toLowerCase() === "search") {
                queryType = QueryType.YOUTUBE_SEARCH;
                args.shift();
            }
            const url = args.join(' ');
            const result = await client.player.search(url, {
                requestedBy: msg.member.user,
                searchEngine: queryType,
            });

            if (result.tracks.length === 0) {
                message.setTitle("No Results");
                return msg.channel.send({ embeds: [message] });
            }
            queue.addTrack(result.tracks[0]);

            message.setTitle(`added ${result.tracks[0].title} to the queue`)
            msg.channel.send({ embeds: [message] })

        } else if (args[0].toLowerCase() === 'remove') {
            if (queue.tracks.length === 0) {
                message.setTitle("The is Queue is already Empty");
                return msg.reply({ embeds: [message] });
            }

            const name = queue.tracks[args[1]-1]
            queue.remove(queue.tracks[args[1]-1]);

            message.setTitle(`removed ${name} from the queue`);
            msg.channel.send({ embeds: [message] });

        } else if (args[0].toLowerCase() === 'list') {
            if (queue.tracks.length === 0) {
                message.setTitle("There is no active Queue")
                msg.channel.send({ embeds: [message] });
            } else {
                message.setTitle("Current Queue")
                for (let v of queue.tracks) {
                    message.setTitle(v.title)
                    .setAuthor({ name: v.author })
                    .setDescription(v.duration)
                    .setThumbnail(v.thumbnail)
                    .setURL(v.url)
                    .setFooter({ text: `Requested by ${v.requestedBy.tag}`, iconURL: v.requestedBy.avatarURL() })
                    msg.channel.send({ embeds: [message] });
                }
            }
        } else if (args[0].toLowerCase() === 'playing') {
            if (!queue.connection || !queue.nowPlaying()) {
                return msg.reply("Nothing is playing currently");
            }
            const message1 = new MessageEmbed()
            .setTitle(queue.current.title)
            .setThumbnail(queue.current.thumbnail)
            .setAuthor({ name: queue.current.author })
            .setDescription(queue.current.duration)
            .setURL(queue.current.url)
            .setFooter({ text: `Requested by ${queue.current.requestedBy.tag}`, iconURL: queue.current.requestedBy.avatarURL() })
            msg.channel.send({ embeds: [message1] })
        } else if (args[0].toLowerCase() === 'skip') {
            if (!queue.connection) {
                message.setTitle("Queue isn't playing");
                return msg.reply({ embeds: [message] });
            }
            if (queue.tracks.length > 0 && queue.connection) {
                queue.skip();
            } else {
                message.setTitle("The Queue is empty")
                return msg.reply({ embeds: [message] });
            }
        } else {
            return msg.reply("Please use Valid Arguements")
        }
    }
}
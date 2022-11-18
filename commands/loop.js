const { MessageEmbed, MessageFlags } = require("discord.js")
require('dotenv').config();

const PREFIX = process.env.PREFIX

module.exports = {
    data: {
        name: null,
        description: "Enable Looping on the current Clip",
        info: `
            ${PREFIX}loop off
            ${PREFIX}loop track
            ${PREFIX}loop queue
            ${PREFIX}loop autoplay
        `
    },
    execute(client, msg, args) {
        const message = new MessageEmbed().setColor("#FFFFFF");
        return msg.reply("Loop Command is undergoing a Fix");
        const options = {
            off: 0,
            track: 1,
            queue: 2,
            autoplay: 3
        }
        if (client.player.getQueue(msg.guild)) {
            if (!options.includes(args[0])) {
                message.setDescription(`Not a valid Option, try ${PREFIX}Help`)
            }
            client.player.getQueue(msg.guild).setRepeatMode(options[args[0]])
        }
    }
}
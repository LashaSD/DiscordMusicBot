const { MessageEmbed } = require('discord.js')
require('dotenv').config();

const PREFIX = process.env.PREFIX

module.exports = {
    data: {
        name: `${PREFIX}Volume`,
        description: "Change the Volume of the Playing Clip",
        info: `
            ${PREFIX}volume *<Number>*
            ${PREFIX}vol *<Number>*
        `,
    },
    execute(client, msg, args) {
        const message = new MessageEmbed()
        .setColor("#FFFFFF");
        if (args[0] != parseInt(args[0])) {
            message.setTitle("Please Provide a Valid Number");
            msg.channel.send({ embeds: [message] })
        }
        if (client.player.getQueue(msg.guild)) {
            const queue = client.player.getQueue(msg.guild) 
            queue.setVolume(parseInt(args[0]));
        }
    }
}
const { MessageEmbed } = require("discord.js")
require("dotenv").config();

const PREFIX = process.env.PREFIX

module.exports = {
    data: {
        name: `${PREFIX}Unpause`,
        description: "Unpauses currently paused Clips",
        info: `
            ${PREFIX}unpause
        `,
    },
    execute(client, msg, args) {
        let queue;
        if (client.player.getQueue(msg.guild))
            queue = client.player.getQueue(msg.guild);

        queue.setPaused(false);
    }   
}
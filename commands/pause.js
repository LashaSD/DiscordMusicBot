const { MessageEmbed } = require("discord.js")
require("dotenv").config();

const PREFIX = process.env.PREFIX

module.exports = {
    data: {
        name: `${PREFIX}Pause`,
        description: "Pauses currently playing Clips",
        info: `
            ${PREFIX}pause
        `,
    },
    execute(client, msg, args) {
        let queue;
        if (client.player.getQueue(msg.guild))
            queue = client.player.getQueue(msg.guild);

        queue.setPaused(true);
    }   
}
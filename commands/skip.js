const { MessageEmbed } = require("discord.js")
require('dotenv').config();
const PREFIX = process.env.PREFIX

module.exports = {
    data: {
        name: `${PREFIX}Skip`,
        description: "Skips to the Next Song",
        info: `
            ${PREFIX}skip
        `,
    },
    execute(client,msg,args) {
        const func = require("../commands/queue.js");
        func.execute(client, msg, ["skip", 'skip']);
    }
}
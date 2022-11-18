const { MessageEmbed } = require('discord.js')
const fs = require('fs')
require('dotenv').config();

const PREFIX = process.env.PREFIX

module.exports = {
    data: {
        name: `${PREFIX}Help`,
        description: "Gives Manual for the Commands",
        info: `
            ${PREFIX}help
        `
    },
    execute(client, msg, args) {
        const message = new MessageEmbed()
        .setColor('#FFFFFF')
        .setTitle(`Information`);
        fs.readdir("./commands", function (err, data) {
            if (err)
                console.error(err);
            for (let v of data) {
                const info = require(`./${v}`);
                if (info.data.name !== null) {
                    message.addField(
                        info.data.name,
                        info.data.info + "\n" + `|> ${info.data.description} <|` + '\n\n'
                    );
                }
                if (v === data[data.length - 1]) {
                    msg.channel.send({ embeds: [message] });
                }
            }
        })
    }
}
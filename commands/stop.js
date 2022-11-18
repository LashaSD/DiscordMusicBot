require("dotenv").config();

const PREFIX = process.env.PREFIX;

module.exports = {
    data: {
        name: `${PREFIX}Stop`,
        description: "Stops the currently playing clip",
        info: `
            ${PREFIX}stop
        `,
    },
    execute(client, msg, args) {
        const queue = client.player.getQueue(msg.guild) ? client.player.getQueue(msg.guild) : undefined;
        if (!queue || !queue.connection || !queue.nowPlaying()) return msg.reply("Nothing is playing currently");
        queue.stop();
    }
}
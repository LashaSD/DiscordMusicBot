require("dotenv").config();

const PREFIX = process.env.PREFIX;

module.exports = {
    data: {
        name: `${PREFIX}Quit`,
        description: "Stops playing the Current Song and clears the Queue",
        info: `
            ${PREFIX}quit
        `,
    },
    execute(client, msg, args) {
        if (client.player.getQueue(msg.guild)) {
            client.player.getQueue(msg.guild).connection.disconnect();
            client.player.deleteQueue(msg.guild)
        }
    }
}
const mineflayer = require("mineflayer");
const config = require("../config.json");
const logger = require("./logger");
const auth = require("./auth");

let reconnectDelay = config.reconnect.initialDelay;

function connect() {

    logger.info("Conectando al servidor...");

    const bot = mineflayer.createBot({
        host: config.server.host,
        port: config.server.port,
        username: config.account.username,
        version: config.server.version
    });

    auth.initialize(bot);

    bot.once("spawn", () => {

        logger.info("Bot conectado.");

        reconnectDelay = config.reconnect.initialDelay;

    });

    bot.on("error", (err) => {

        logger.error(err.toString());

    });

    bot.on("end", () => {

        logger.warning(`Reconectando en ${reconnectDelay / 1000} segundos...`);

        setTimeout(() => {

            connect();

        }, reconnectDelay);

        reconnectDelay = Math.min(
            reconnectDelay * config.reconnect.factor,
            config.reconnect.maxDelay
        );

    });

}

module.exports = {
    connect
};
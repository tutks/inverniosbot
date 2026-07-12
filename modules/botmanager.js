const mineflayer = require("mineflayer");
const movement = require("./movement");
const config = require("../config.json");
const logger = require("./logger");
const auth = require("./auth");
const chat = require("./chat");

let bot = null;

let reconnectDelay = config.reconnect.initialDelay;
let reconnectTimer = null;

let state = "DISCONNECTED";
// DISCONNECTED
// CONNECTING
// CONNECTED
// RECONNECT_WAIT

function start() {
    createBot();
}

function createBot() {

    if (state === "CONNECTING" || state === "CONNECTED") {
        return;
    }

    state = "CONNECTING";

    logger.info("Conectando al servidor...");

    bot = mineflayer.createBot({
        host: config.server.host,
        port: config.server.port,
        username: config.account.username,
        version: config.server.version
    });

    auth.initialize(bot);
    movement.initialize(bot);
    chat.initialize(bot);

    bot.once("spawn", () => {
    
        logger.info("Bot conectado.");

        state = "CONNECTED";

        reconnectDelay = config.reconnect.initialDelay;

        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }

    });

    bot.on("kicked", (reason) => {

        logger.warning("Bot expulsado.");
        logger.warning(String(reason));

        scheduleReconnect();

    });

    bot.on("end", () => {

        logger.warning("Conexión finalizada.");

        scheduleReconnect();

    });

    bot.on("error", (err) => {

        logger.error(err.toString());

    });

}

function scheduleReconnect() {

    if (state === "RECONNECT_WAIT") {
        return;
    }

    state = "RECONNECT_WAIT";

    if (reconnectTimer) {
        return;
    }

    logger.info(`Reconectando en ${reconnectDelay / 1000} segundos...`);

    reconnectTimer = setTimeout(() => {

        reconnectTimer = null;

        state = "DISCONNECTED";

        createBot();

    }, reconnectDelay);

    reconnectDelay = Math.min(
        reconnectDelay * config.reconnect.factor,
        config.reconnect.maxDelay
    );

}

module.exports = {
    start
};
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

    if (bot) {

        try {
            bot.removeAllListeners();

            if (bot._client) {
                bot._client.removeAllListeners();
            }

            bot.end();
        } catch {}

        bot = null;
    }

    state = "CONNECTING";

    logger.info("Conectando al servidor...");

    bot = mineflayer.createBot({

        host: config.server.host,
        port: config.server.port,
        username: config.account.username,
        version: config.server.version

    });
        bot.on("error", (err) => {
            console.log("Error:", err.message);
        })

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

        cleanup();

        scheduleReconnect();

    });

    bot.on("end", () => {

        logger.warning("Conexión finalizada.");

        cleanup();

        scheduleReconnect();

    });

    bot.on("error", (err) => {

        logger.error(err.toString());

    });

}

function cleanup() {

    state = "DISCONNECTED";

    if (!bot) return;

    try {

        bot.removeAllListeners();

        if (bot._client) {
            bot._client.removeAllListeners();
        }

    } catch {}

}

function scheduleReconnect() {

    if (reconnectTimer) {
        return;
    }

    state = "RECONNECT_WAIT";

    logger.info(`Reconectando en ${reconnectDelay / 1000} segundos...`);

    reconnectTimer = setTimeout(() => {

        reconnectTimer = null;

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
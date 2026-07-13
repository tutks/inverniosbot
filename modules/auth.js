const config = require("../config.json");
const logger = require("./logger");

function initialize(bot) {

    let authSent = false;

    bot.once("spawn", () => {
        authSent = false;
    });

    // Detectar mensajes del servidor
    bot.on("messagestr", (message) => {

        logger.debug(`[CHAT] ${message}`);

        const msg = message.toLowerCase();

        if (!authSent && msg.includes("/register")) {

            authSent = true;

            logger.info("Detectado registro.");

            bot.chat(`/register ${config.account.password} ${config.account.password}`);

            return;

        }

        if (!authSent && msg.includes("/login")) {

            authSent = true;

            logger.info("Detectado login.");

            bot.chat(`/login ${config.account.password}`);

        }

    });

    // Debug de paquetes
    if (config.debug.packets) {

        const packetsToLog = new Set([
            "keep_alive",
            "login",
            "disconnect",
            "system_chat",
            "player_chat",
            "game_event",
            "register"
        ]);

        bot._client.on("packet", (data, meta) => {

            if (packetsToLog.has(meta.name)) {
                logger.debug(`[PACKET] ${meta.name}`);
            }

        });

    }

}

module.exports = {
    initialize
};
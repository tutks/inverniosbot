const config = require("../config.json");
const logger = require("./logger");

function initialize(bot) {

    // Detectar mensajes del servidor
    bot.on("messagestr", (message) => {

        logger.debug(`[CHAT] ${message}`);

        const msg = message.toLowerCase();

        if (msg.includes("/register")) {

            logger.info("Detectado registro.");

            bot.chat(`/register ${config.account.password} ${config.account.password}`);

        }

        if (msg.includes("/login")) {

            logger.info("Detectado login.");

            bot.chat(`/login ${config.account.password}`);

        }

    });

    // Debug de paquetes
    if (config.debug.packets) {

        bot._client.on("packet", (data, meta) => {

            logger.debug(`[PACKET] ${meta.name}`);

        });

    }

}

module.exports = {
    initialize
};
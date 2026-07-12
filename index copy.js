// ========================================
// Importar librerías
// ========================================

const mineflayer = require("mineflayer");
const config = require("./config.json");
const auth = require("./modules/auth");
const logger = require("./modules/logger");

// ========================================
// Crear el bot
// ========================================

const bot = mineflayer.createBot({
    host: config.server.host,
    port: config.server.port,
    username: config.account.username,
    version: config.server.version
});

// Inicializar módulos
auth.initialize(bot);

// ========================================
// Eventos
// ========================================

bot.once("spawn", () => {

    logger.info("El bot entró correctamente al servidor.");

});

// Cuando ocurre un error
bot.on("error", (err) => {

    logger.error(err.toString());

});

// Cuando se desconecta
bot.on("end", (reason) => {

    logger.warning(`Bot desconectado: ${reason}`);

});
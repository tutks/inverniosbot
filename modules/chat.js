const config = require("../config.json");

let chatTimer = null;
let loginTime = Date.now();

const recentMessages = [];
const MAX_RECENT_MESSAGES = 3;

function initialize(bot) {

    if (!config.chat.enabled) return;

    bot.once("spawn", () => {

        loginTime = Date.now();

        schedule(bot);

    });

    bot.on("end", () => {

        if (chatTimer) {
            clearTimeout(chatTimer);
            chatTimer = null;
        }

    });

}

function schedule(bot) {

    const delay = random(
        config.chat.minDelay,
        config.chat.maxDelay
    );

    chatTimer = setTimeout(() => {

        sendMessage(bot);

    }, delay);

}

function sendMessage(bot) {

    if (!bot || !bot.entity) {
        schedule(bot);
        return;
    }

    let availableMessages = config.chat.messages.filter(
        message => !recentMessages.includes(message)
    );

    if (availableMessages.length === 0) {
        recentMessages.length = 0;
        availableMessages = [...config.chat.messages];
    }

    const message = availableMessages[
        Math.floor(Math.random() * availableMessages.length)
    ];

    const finalMessage = replaceVariables(bot, message);

    bot.chat(finalMessage);

    recentMessages.push(message);

    if (recentMessages.length > MAX_RECENT_MESSAGES) {
        recentMessages.shift();
    }

    schedule(bot);

}

function replaceVariables(bot, message) {

    const onlinePlayers = Object.keys(bot.players).length;

    const playerNames = Object.keys(bot.players)
        .filter(name => name !== bot.username);

    const randomPlayer =
        playerNames.length > 0
            ? playerNames[Math.floor(Math.random() * playerNames.length)]
            : "nadie";

    const hours = Math.floor((Date.now() - loginTime) / 3600000);
    const minutes = Math.floor(((Date.now() - loginTime) % 3600000) / 60000);

    message = message.replaceAll("{player}", randomPlayer);

    message = message.replaceAll("{players}", onlinePlayers);

    message = message.replaceAll("{time}", `${hours}h ${minutes}m`);

    message = message.replaceAll("{health}", Math.floor(bot.health));

    message = message.replaceAll("{food}", Math.floor(bot.food));

    // Día del mundo (si Mineflayer lo expone)
    if (bot.time && typeof bot.time.age === "number") {
        const worldDay = Math.floor(bot.time.age / 24000) + 1;
        message = message.replaceAll("{day}", worldDay);
    }

    // Día o noche
    if (bot.time) {

        let isDay = "desconocido";

        if (typeof bot.time.isDay === "boolean") {
            isDay = bot.time.isDay ? "día" : "noche";
        } else if (typeof bot.time.timeOfDay === "number") {
            isDay = (bot.time.timeOfDay >= 0 && bot.time.timeOfDay < 12000)
                ? "día"
                : "noche";
        }

        message = message.replaceAll("{daytime}", isDay);

    }

    // Clima
    if (typeof bot.isRaining === "boolean") {
        message = message.replaceAll(
            "{weather}",
            bot.isRaining ? "lloviendo" : "despejado"
        );
    }

    // Bioma
    if (bot.entity && bot.entity.position) {

        try {

            const biome = bot.world.getBiome(bot.entity.position);

            if (biome && biome.name) {
                message = message.replaceAll("{biome}", biome.name);
            }

        } catch {}

    }

    // Dimensión
    if (bot.game && bot.game.dimension) {
        message = message.replaceAll("{dimension}", bot.game.dimension);
    }

    return message;

}

function random(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;

}

module.exports = {
    initialize
};
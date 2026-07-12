const config = require("../config.json");

let chatTimer = null;

const recentMessages = [];
const MAX_RECENT_MESSAGES = 3;

function initialize(bot) {

    if (!config.chat.enabled) return;

    bot.once("spawn", () => {
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

    bot.chat(message);

    recentMessages.push(message);

    if (recentMessages.length > MAX_RECENT_MESSAGES) {
        recentMessages.shift();
    }

    schedule(bot);

}

function random(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;

}

module.exports = {
    initialize
};
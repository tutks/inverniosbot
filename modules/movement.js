const config = require("../config.json");

let movementTimer = null;
let walkTimer = null;

function initialize(bot) {

    if (!config.movement.enabled) return;

    bot.once("spawn", () => {

        stop();
        schedule(bot);

    });

    bot.on("end", () => {

        stop();

    });

}

function stop() {

    if (movementTimer) {
        clearTimeout(movementTimer);
        movementTimer = null;
    }

    if (walkTimer) {
        clearTimeout(walkTimer);
        walkTimer = null;
    }

}

function schedule(bot) {

    if (!bot || !bot.entity) return;

    const delay = random(
        config.movement.minDelay,
        config.movement.maxDelay
    );

    movementTimer = setTimeout(() => {

        move(bot);

    }, delay);

}

function move(bot) {

    if (!bot || !bot.entity) return;

    const directions = [
        "forward",
        "back",
        "left",
        "right"
    ];

    const direction = directions[
        Math.floor(Math.random() * directions.length)
    ];

    bot.setControlState(direction, true);

    const walkTime = random(
        config.movement.minWalkTime,
        config.movement.maxWalkTime
    );

    walkTimer = setTimeout(() => {

        if (bot && bot.entity) {
            bot.setControlState(direction, false);
            schedule(bot);
        }

    }, walkTime);

}

function random(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;

}

module.exports = {
    initialize
};
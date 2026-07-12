const config = require("../config.json");

let movementTimer = null;

function initialize(bot) {

    if (!config.movement.enabled) return;

    bot.once("spawn", () => {

        start(bot);

    });

    bot.on("end", () => {

        if (movementTimer) {
            clearTimeout(movementTimer);
            movementTimer = null;
        }

    });

}

function start(bot) {

    schedule(bot);

}

function schedule(bot) {

    const delay = random(
        config.movement.minDelay,
        config.movement.maxDelay
    );

    movementTimer = setTimeout(() => {

        move(bot);

    }, delay);

}

function move(bot) {

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

    setTimeout(() => {

        bot.setControlState(direction, false);

        schedule(bot);

    }, walkTime);

}

function random(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;

}

module.exports = {
    initialize
};
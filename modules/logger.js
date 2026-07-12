const fs = require("fs");
const path = require("path");
const config = require("../config.json");

const logFile = path.join(__dirname, "..", "logs", "latest.log");

function write(type, message) {

    const date = new Date().toLocaleString();

    const line = `[${date}] [${type}] ${message}`;

    console.log(line);

    if (config.debug.saveLogs) {
        fs.appendFileSync(logFile, line + "\n");
    }

}

function info(message) {
    write("INFO", message);
}

function debug(message) {

    if (config.debug.enabled) {
        write("DEBUG", message);
    }

}

function warning(message) {
    write("WARNING", message);
}

function error(message) {
    write("ERROR", message);
}

module.exports = {
    info,
    debug,
    warning,
    error
};
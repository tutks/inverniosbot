const fs = require("fs");
const path = require("path");
const config = require("../config.json");

const logsDir = path.join(__dirname, "..", "logs");
const logFile = path.join(logsDir, "latest.log");

// Crear carpeta logs si no existe
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

function write(type, message) {

    const date = new Date().toLocaleString();

    const line = `[${date}] [${type}] ${message}`;

    console.log(line);

    if (config.debug.saveLogs) {

        fs.appendFile(
            logFile,
            line + "\n",
            (err) => {

                if (err) {
                    console.error("Error escribiendo el log:", err);
                }

            }
        );

    }

}

function info(message) {
    write("INFO", message);
}

function debug(message) {

    if (!config.debug.enabled) {
        return;
    }

    write("DEBUG", message);

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
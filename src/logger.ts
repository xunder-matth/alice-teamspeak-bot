import * as path from "path";
import * as fs from "fs";

const logDir = path.join(__dirname, "..", "logs");

const LogInfo = (message: string): void => {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    const date = new Date();
    const logPath = path.join(
        logDir,
        `info-${date.getDay().toString().padStart(2, "0")}-${date
            .getMonth()
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}.log`
    );

    fs.appendFileSync(
        logPath,
        `[${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${date
            .getSeconds()
            .toString()
            .padStart(2, "0")}.${date.getMilliseconds()}] ` +
            message +
            "\n"
    );
};

const LogError = (message: string): void => {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    const date = new Date();
    const logPath = path.join(
        logDir,
        `error-${date.getDay().toString().padStart(2, "0")}-${date
            .getMonth()
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}.log`
    );

    fs.appendFileSync(
        logPath,
        `[${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${date
            .getSeconds()
            .toString()
            .padStart(2, "0")}.${date.getMilliseconds()}] ` +
            message +
            "\n"
    );
};

export { LogInfo, LogError };

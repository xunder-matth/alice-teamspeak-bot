const log = (message: string, error?: Error) => {
    let logMessage = `[${new Date().toLocaleString()}] ${message}`;
    if (error) {
        logMessage += `\n${error.toString()}`;
    }
    logMessage += '\n';

    process.stdout.write(logMessage);
};

export default {
    log,
};
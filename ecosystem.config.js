module.exports = {
    apps: [
        {
            name: "alice-teamspeak-bot",
            script: "./dist/index.js",
            error_file: "./logs/err.log",
            out_file: "./logs/out.log",
            log_date_format: "DD-MM HH:mm:ss.SSS",
            env_production: {
                NODE_ENV: "production",
            },
            env_development: {
                NODE_ENV: "development",
            },
        },
    ],
};

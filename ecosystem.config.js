module.exports = {
    apps: [
        {
            name: "alice",
            script: "ts-node",
            args: "./index.ts",
            error_file: "./pm2_error.log",
            out_file: "./pm2_out.log",
            env_production: {
                NODE_ENV: "production",
            },
            env_development: {
                NODE_ENV: "development",
            },
        },
    ],
};

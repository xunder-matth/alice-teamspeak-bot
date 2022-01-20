import TSConnection from "./connection";
import { LogError, LogInfo } from "./logger";
import { ClientType } from "ts3-nodejs-library";
import * as config from "./config/welcomer.json";

const messages = config.message;

export const registerWelcomer = (): void => {
    TSConnection.on("clientconnect", async (event) => {
        try {
            const client = event.client;

            if (client.type !== ClientType.Regular) {
                return;
            }

            const message = messages
                .join("\n")
                .replace("%nickname%", client.nickname);

            client.message(message);
        } catch (error) {
            LogInfo("An error occured in 'Welcomer'.");

            LogError(error as string);
        }
    });
};

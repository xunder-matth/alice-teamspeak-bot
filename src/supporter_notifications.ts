import TSConnection from "./connection";
import { LogError, LogInfo } from "./logger";
import { ClientType } from "ts3-nodejs-library";
import * as config from "./config/notifications.json";

const supporterGroupIds = config.supporter_groups.map(String);
const notifyChannels = config.channels.map(String);
const ignoredGroupIds = config.ignored_groups.map(String);

export const registerNotifications = (): void => {
    TSConnection.on("clientmoved", async (event) => {
        try {
            const channel = event.channel;
            const client = event.client;
            const reason = event.reasonid;

            if (!notifyChannels.includes(channel.cid)) {
                return;
            }

            if (reason !== "0") {
                return;
            }

            const groupsToIgnore = ignoredGroupIds.concat(supporterGroupIds);

            if (groupsToIgnore?.some((r) => client.servergroups.includes(r))) {
                return;
            }

            const supporterList = await TSConnection.clientList({
                clientType: ClientType.Regular,
                clientServergroups: supporterGroupIds,
            });

            const encodedNick = encodeURIComponent(client.nickname);

            const message = config.message
                .join("\n")
                .replace("%clid%", client.clid)
                .replace("%uuid%", client.uniqueIdentifier)
                .replace("%encodednickname%", encodedNick)
                .replace("%nickname%", client.nickname)
                .replace("%channel%", channel.name);

            for (const supporter of supporterList) {
                supporter.message(message);
            }
        } catch (error) {
            LogInfo("An error occured in 'Notifications'.");

            LogError(error as string);
        }
    });
};

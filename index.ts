import "dotenv/config";

import TSConnection from "./src/connection";
import { LogError } from "./src/logger";
import { Terminal } from "./src/terminal";
import * as os from "os";
import {
    welcomer as WELCOMER,
    supporter_notifications as SUPPORTER_NOTIFICATIONS,
    community_servers as COMMUNITY_SERVERS,
    ts_info as SERVER_INFO,
} from "./src/config/settings.json";

const terminal = new Terminal();

const main = async () => {
    terminal.cyanLog(
        "[================ TeamSpeak Bot Started ================]"
    );
    terminal.cyanLog(`[ Platform: ${os.release()}`);
    terminal.cyanLog(`[ Node version: ${process.version}`);
    terminal.cyanLog(`[ Welcomer ${WELCOMER ? "is" : "is not"} active`);
    terminal.cyanLog(
        `[ Supporter notifications ${
            SUPPORTER_NOTIFICATIONS ? "are" : "are not"
        } active`
    );
    terminal.cyanLog(
        `[ Community server querys ${
            COMMUNITY_SERVERS ? "are" : "are not"
        } active`
    );
    terminal.cyanLog(
        "[=======================================================]"
    );

    const ts = await TSConnection.connect();

    terminal.greenLog("Connection to TeamSpeak successful.");

    if (WELCOMER) {
        (await import("./src/welcomer")).registerWelcomer();
    }

    if (SUPPORTER_NOTIFICATIONS) {
        (await import("./src/supporter_notifications")).registerNotifications();
    }

    if (COMMUNITY_SERVERS) {
        (await import("./src/server")).registerCommunityServers();
    }

    if (SERVER_INFO) {
        (await import("./src/ts_info")).queryTSInfo();
    }

    ts.on("error", (error) => {
        terminal.redLog("An error occured (see logs)!");
        LogError(error.name);
        LogError(error.message);

        if (typeof error.stack == "string") {
            LogError(error.stack);
        }
    });

    ts.on("close", (error) => {
        if (error) {
            terminal.redLog("Connection closed due to error (see logs)!");

            LogError(error.name);
            LogError(error.message);

            if (typeof error.stack == "string") {
                LogError(error.stack);
            }
        } else {
            terminal.redLog("Connection closed!");
        }
    });
};

main();

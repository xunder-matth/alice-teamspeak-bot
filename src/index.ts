require('dotenv').config();

import TeamSpeakConnection from "./TeamSpeakConnection";
import RankConnection from "./RankConnection";
import * as NotifySupport from "./modules/NotifySupport";
import * as ServerInfo from "./modules/ServerInfo";
import * as Statistics from "./modules/Statistics";
import * as CommunityServers from "./modules/CommunityServers";
import * as Welcomer from "./modules/Welcomer";
import * as Banner from "./modules/Banner";
import * as Staff from "./modules/Staff";
import path from "path";
import http from "http";
import fs from "fs";

const main = async () => {
    console.log(`Trying to connect to ${process.env.TS3_HOST}:${process.env.TS3_PORT}`);

    await TeamSpeakConnection.connect().then(async teamspeak => {
        const PORT = parseInt(process.env.WEB_PORT as string);

        console.log("Connection successful!");

        NotifySupport.registerWaitingForSupportNotify();
        ServerInfo.updateServerInfo();
        CommunityServers.updateCommunityServers();
        Welcomer.registerWelcomer();
        Banner.Generate();
        Staff.Update();

        RankConnection.connect(error => {
            if (error) {
                console.log(error);
                process.exit();
            }

            console.log(`Successfully connected to Rank System database. (Thread id: ${RankConnection.threadId})`);

            Statistics.updateServerStatistics();
        });

        if (PORT) {
            http.createServer((req, res) => {
                if (req.method === "GET" && req.url === "/banner") {
                    res.writeHead(200, { 'Content-Type': 'image/png' });
                    fs.createReadStream(path.join(__dirname + '/resources/banner.png')).pipe(res);
                } else {
                    res.setHeader('Content-Type', 'text/plain');
                    res.statusCode = 404;
                    res.end("Not found!");
                }
            }).listen(PORT, () => {
                console.log(`HTTP Listening to port ${PORT}.`);
            });
        }

        teamspeak.on("error", (e) => {
            console.log("An error occured", e);
        });
    }).catch(e => {
        console.log("Catched an error!");
        console.error(e);
    });
}

main();

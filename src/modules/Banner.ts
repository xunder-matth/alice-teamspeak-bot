import TeamSpeakConnection from "../TeamSpeakConnection";
import { ClientType } from "ts3-nodejs-library";
import { getRootDir } from "../utils/helpers";
import path from "path";
import gm = require("gm");

interface TextConfig {
    regionX: number;
    regionY: number;
    regionWidth: number;
    regionHeight: number;
    gravity: string;
    text: string;
    textX: number;
    textY: number;
    textFont: string;
    textFill: string;
    textSize: number;
}

export const Generate = async () => {
    const server = await TeamSpeakConnection.serverInfo();
    const onlineClients = server.virtualserverClientsonline - server.virtualserverQueryclientsonline;
    const maxClients = server.virtualserverMaxclients;
    const clients = await TeamSpeakConnection.clientList({ 
        clientType: ClientType.Regular
    });
    const onlineAdminQuerys = clients.filter(client => client.servergroups.includes(process.env.ADMIN_QUERY_GROUP as string)).length;
    const onlineSupporters = clients.filter(client => client.servergroups.includes(process.env.SUPPORTER_GROUP as string)).length;
    const SquadaOneFont = path.join(`${getRootDir()}/resources/SquadaOne-Regular.ttf`);

    const texts: TextConfig[] = [
        {
            regionX: 183,
            regionY: 196,
            regionWidth: 160,
            regionHeight: 98,
            gravity: "Center",
            text: `${onlineClients}/${maxClients}`,
            textX: 0,
            textY: 0,
            textFont: SquadaOneFont,
            textFill: "#ff0018",
            textSize: 50
        },
        {
            regionX: 497,
            regionY: 196,
            regionWidth: 160,
            regionHeight: 98,
            gravity: "Center",
            text: `${maxClients}/${maxClients}`,
            textX: 0,
            textY: 0,
            textFont: SquadaOneFont,
            textFill: "#ff0018",
            textSize: 50
        },
        {
            regionX: 1129,
            regionY: 196,
            regionWidth: 139,
            regionHeight: 98,
            gravity: "West",
            text: `${onlineSupporters}`,
            textX: 0,
            textY: 0,
            textFont: SquadaOneFont,
            textFill: "#340808",
            textSize: 50
        },
        {
            regionX: 1487,
            regionY: 196,
            regionWidth: 139,
            regionHeight: 98,
            gravity: "West",
            text: `${onlineAdminQuerys}`,
            textX: 0,
            textY: 0,
            textFont: SquadaOneFont,
            textFill: "#340808",
            textSize: 50
        }
    ];
    
    const input = path.join(`${getRootDir()}/resources/banner-template.png`);
    const output = path.join(`${getRootDir()}/resources/banner.png`);
    const image = gm(input);

    texts.forEach(text => {
        image
        .fill(text.textFill)
        .font(text.textFont, text.textSize)
        .region(text.regionWidth, text.regionHeight, text.regionX, text.regionY)
        .gravity(text.gravity)
        .drawText(text.textX, text.textY, text.text);
    });

    image.write(output, (err) => {
        if (err) {
            console.log(`Error writing banner image.`, err);
        }
    });

    setTimeout(() => {
        Generate();
    }, 60000);
};

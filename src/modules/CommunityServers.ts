import TeamSpeakConnection from '../TeamSpeakConnection';
import gamedig from 'gamedig';

const UPDATE_COMMUNITY_SERVERS = parseInt(process.env.UPDATE_COMMUNITY_SERVERS as string);

async function updateCSPublic() {
    const channel = await TeamSpeakConnection.getChannelById(process.env.CS_SERVER_CHANNEL as string);

    if (channel) {
        gamedig.query({
            type: 'cs16',
            host: '51.195.123.185',
            port: 27015
        }).then((data) => {
            const rawData: any = data.raw;

            if (!rawData) {
                throw Error("Cannot get raw data.");
            }

            let numplayers: number = 0;

            if ("numplayers" in rawData) {
                numplayers = rawData.numplayers;
            } 
            if ("numbots" in rawData) {
                numplayers += rawData.numbots;
            }
            
            channel.edit({
                channelName: `[cspacer]CS 1.6 • Public • ${numplayers}/${data.maxplayers}`,
                channelDescription: `[size=9]Hostname: [COLOR=#990000][B]${data.name}[/B][/COLOR]
Address: [COLOR=#990000][B]${data.connect}[/B][/COLOR]
Map: [COLOR=#990000][B]${data.map}[/B][/COLOR]
Players: [COLOR=#990000][B]${numplayers}/${data.maxplayers}[/B][/COLOR]
Ping: [COLOR=#990000][B]${data.ping} ms[/B][/COLOR][/size]
[center][B][size=8][hr]» [COLOR=#990000]Skill Arena[/COLOR] Public TeamSpeak «
» Contact: [COLOR=#990000]public@sa-rpg.com[/COLOR] «[hr][/size][/B][/center]`
            });
        }).catch((error) => {
            console.log("Cannot query CS 1.6 server.");
        });
    }
}

async function updateCSDeathMatch() {
    const channel = await TeamSpeakConnection.getChannelById(process.env.CS_DM_SERVER_CHANNEL as string);

    if (channel) {
        gamedig.query({
            type: 'cs16',
            host: '51.195.123.185',
            port: 27016
        }).then((data) => {
            const rawData: any = data.raw;

            if (!rawData) {
                throw Error("Cannot get raw data.");
            }

            let numplayers: number = 0;

            if ("numplayers" in rawData) {
                numplayers = rawData.numplayers;
            } 
            if ("numbots" in rawData) {
                numplayers += rawData.numbots;
            }
            
            channel.edit({
                channelName: `[cspacer]CS 1.6 • DeathMatch • ${numplayers}/${data.maxplayers}`,
                channelDescription: `[size=9]Hostname: [COLOR=#990000][B]${data.name}[/B][/COLOR]
Address: [COLOR=#990000][B]${data.connect}[/B][/COLOR]
Map: [COLOR=#990000][B]${data.map}[/B][/COLOR]
Players: [COLOR=#990000][B]${numplayers}/${data.maxplayers}[/B][/COLOR]
Ping: [COLOR=#990000][B]${data.ping} ms[/B][/COLOR][/size]
[center][B][size=8][hr]» [COLOR=#990000]Skill Arena[/COLOR] Public TeamSpeak «
» Contact: [COLOR=#990000]public@sa-rpg.com[/COLOR] «[hr][/size][/B][/center]`
            });
        }).catch((error) => {
            console.log("Cannot query CS 1.6 server.");
        });
    }
}

async function updateSAMPServer() {
    const channel = await TeamSpeakConnection.getChannelById(process.env.SAMP_SERVER_CHANNEL as string);

    if (channel) {
        gamedig.query({
            type: 'samp',
            host: '51.89.25.168',
            port: 7777
        }).then((data) => {
            const rawData: any = data.raw;

            if (!rawData) {
                throw Error("Cannot get raw data.");
            }

            let numplayers: number = 0;

            if ("numplayers" in rawData) {
                numplayers = rawData.numplayers;
            }

            channel.edit({
                channelName: `[cspacer]SAMP • RolePlay • ${numplayers}/${data.maxplayers}`,
                channelDescription: `[size=9]Hostname: [COLOR=#990000][B]${data.name}[/B][/COLOR]
Address: [COLOR=#990000][B]${data.connect}[/B][/COLOR]
GameMode Version: [COLOR=#990000][B]${rawData["gamemode"]}[/B][/COLOR]
Players: [COLOR=#990000][B]${numplayers}/${data.maxplayers}[/B][/COLOR]
Ping: [COLOR=#990000][B]${data.ping} ms[/B][/COLOR][/size]
[center][B][size=8][hr]» [COLOR=#990000]Skill Arena[/COLOR] Public TeamSpeak «
» Contact: [COLOR=#990000]public@sa-rpg.com[/COLOR] «[hr][/size][/B][/center]`
            });
        }).catch((error) => {
            console.log("Cannot query SA:MP server.");
        });
    }
}

export const updateCommunityServers = async () => {
    updateCSPublic();
    updateCSDeathMatch();
    updateSAMPServer();

    setTimeout(() => {
        updateCommunityServers();
    }, UPDATE_COMMUNITY_SERVERS);
};

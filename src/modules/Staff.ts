import TeamSpeakConnection from "../TeamSpeakConnection";

const UPDATE_ONLINE_STAFF = parseInt(process.env.UPDATE_ONLINE_STAFF as string);

async function UpdateStaffList() {
    const channel = await TeamSpeakConnection.getChannelById(process.env.STAFF_LIST_CHANNEL as string);

    if (!channel) {
        throw Error("Cannot find Staff list channel.");
    }

    let count = 0;
    let buffer = "[center][img]http://gaming.sa-rpg.com/resources/Query_20x20.png[/img] [b][size=12]Admin Server Query[/size][/b]\n\
[table][tr][th]#[/th][th]        Nickname        [/th][/tr]";

    const adminQuerys = await TeamSpeakConnection.serverGroupClientList(process.env.ADMIN_QUERY_GROUP as string);
    const ignoredQuerys = (process.env.IGNORED_ADMIN_QUERY_CLIENTS as string).replace(/\s/g, "").split(",");

    adminQuerys.sort((a, b): number => {
        return +a.cldbid - +b.cldbid;
    }).forEach(async (client) => {
        const dbid = client.cldbid;
        const isOnline = await TeamSpeakConnection.getClientByDbid(dbid);

        if (!ignoredQuerys.includes(dbid)) {
            if (isOnline) {
                buffer += `[tr][td]${++ count}.[/td][td][center][url=client://UNDEFINED/${client.clientUniqueIdentifier}][color=#3cb659]${client.clientNickname}[/color][/url][/center][/td][/tr]`;
            } else {
                buffer += `[tr][td]${++ count}.[/td][td][center][url=client://UNDEFINED/${client.clientUniqueIdentifier}][color=#ff0000]${client.clientNickname}[/color][/url][/center][/td][/tr]`;
            }
        }
    });

    const administartors = await TeamSpeakConnection.serverGroupClientList(process.env.ADMINISTRATOR_GROUP as string);

    count = 0;
    buffer += "[/table][/center]\n[center][img]http://gaming.sa-rpg.com/resources/Administrator_20x20.png[/img] [b][size=12]Administrator[/size][/b]\n\
    [table][tr][th]#[/th][th]        Nickname        [/th][/tr]";

    administartors.sort((a, b): number => {
        return +a.cldbid - +b.cldbid;
    }).forEach(async (client) => {
        const isOnline = await TeamSpeakConnection.getClientByDbid(client.cldbid);

        if (isOnline) {
            buffer += `[tr][td]${++ count}.[/td][td][center][url=client://UNDEFINED/${client.clientUniqueIdentifier}][color=#3cb659]${client.clientNickname}[/color][/url][/center][/td][/tr]`;
        } else {
            buffer += `[tr][td]${++ count}.[/td][td][center][url=client://UNDEFINED/${client.clientUniqueIdentifier}][color=#ff0000]${client.clientNickname}[/color][/url][/center][/td][/tr]`;
        }
    });

    const supporters = await TeamSpeakConnection.serverGroupClientList(process.env.SUPPORTER_GROUP as string);

    count = 0;
    buffer += "[/table][/center]\n[center][img]http://gaming.sa-rpg.com/resources/Supporter_20x20.png[/img] [b][size=12]Supporter[/size][/b]\n\
    [table][tr][th]#[/th][th]        Nickname        [/th][/tr]";

    supporters.sort((a, b): number => {
        return +a.cldbid - +b.cldbid;
    }).forEach(async (client) => {
        const isOnline = await TeamSpeakConnection.getClientByDbid(client.cldbid);

        if (isOnline) {
            buffer += `[tr][td]${++ count}.[/td][td][center][url=client://UNDEFINED/${client.clientUniqueIdentifier}][color=#3cb659]${client.clientNickname}[/color][/url][/center][/td][/tr]`;
        } else {
            buffer += `[tr][td]${++ count}.[/td][td][center][url=client://UNDEFINED/${client.clientUniqueIdentifier}][color=#ff0000]${client.clientNickname}[/color][/url][/center][/td][/tr]`;
        }
    });

    const channelInfo = await channel.getInfo();

    buffer += 
"[/table][/center]\n\
[center][B][size=8][hr]» [COLOR=#990000]Skill Arena[/COLOR] Public TeamSpeak «\n\
» Contact: [COLOR=#990000]public@sa-rpg.com[/COLOR] «[hr][/size][/B][/center]";

    if (channelInfo.channelDescription !== buffer) {
        channel.edit({
            channelDescription: buffer
        });
    }
}

export const Update = () => {
    UpdateStaffList();

    setTimeout(() => {
        Update();
    }, UPDATE_ONLINE_STAFF);
};

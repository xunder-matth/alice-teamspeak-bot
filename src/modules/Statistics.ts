import TeamSpeakConnection from '../TeamSpeakConnection';
import RankConnection from '../RankConnection';

const UPDATE_STATISTICS = parseInt(process.env.UPDATE_STATISTICS as string);
let ignoreGroups: string[];

async function updateTopOnline() {
    RankConnection.query("SELECT `name`,`cldgroup`,`count` FROM `user` ORDER BY `user`.`count` DESC", async (error, results: any[]) => {
        if (error) {
            console.log(error);
            return;
        }

        if (results == null) {
            return;
        }

        var data: any[] = [];
        var count = 0;
        var buffer = "[center][table][tr][th]#[/th][th]         Client name         [/th][th]Time[/th][/tr]";

        results.every(result => {
            if (count == 10) {
                return false;
            }

            const cldgroup = result.cldgroup.split(",");
            const intersection = ignoreGroups.filter(element => cldgroup.includes(element));

            if (intersection.length == 0) {
                data.push(result);
                count = count + 1;
            }
            return true;
        });

        count = 0;

        data.forEach(client => {
            buffer += `[tr][td][center]${++count}.[/center][/td][td][center]${client.name}[/center][/td][td][center]${parseSecondsToString(client.count)}[/center][/td][/tr]`;
        });

        buffer += `[/table][/center]
        
[center][B][size=8][hr]» [COLOR=#990000]Skill Arena[/COLOR] Public TeamSpeak «
» Contact: [COLOR=#990000]public@sa-rpg.com[/COLOR] «[hr][/size][/B][/center]`;

        const channel = await TeamSpeakConnection.getChannelById(process.env.TOP_ONLINE_CHANNEL as string);

        if (channel) {
            const channelInfo = await channel.getInfo();

            if (channelInfo.channelDescription !== buffer) {
                channel.edit({
                    channelDescription: buffer
                });
            }
        }
    });
}

async function updateTopActive() {
    RankConnection.query("SELECT `name`,`cldgroup`,`count`,`idle` FROM `user` ORDER BY (`count`-`idle`) DESC", async (error, results: any[]) => {
        if (error) {
            console.log(error);
            return;
        }

        if (results == null) {
            return;
        }

        var data: any[] = [];
        var count = 0;
        var buffer = "[center][table][tr][th]#[/th][th]         Client name         [/th][th]Time[/th][/tr]";

        results.every(result => {
            if (count == 10) {
                return false;
            }

            const cldgroup = result.cldgroup.split(",");
            const intersection = ignoreGroups.filter(element => cldgroup.includes(element));

            if (intersection.length == 0) {
                data.push(result);
                count = count + 1;
            }
            return true;
        });

        count = 0;

        data.forEach(client => {
            buffer += `[tr][td][center]${++count}.[/center][/td][td][center]${client.name}[/center][/td][td][center]${parseSecondsToString(client.count - client.idle)}[/center][/td][/tr]`;
        });

        buffer += `[/table][/center]
        
[center][B][size=8][hr]» [COLOR=#990000]Skill Arena[/COLOR] Public TeamSpeak «
» Contact: [COLOR=#990000]public@sa-rpg.com[/COLOR] «[hr][/size][/B][/center]`;

        const channel = await TeamSpeakConnection.getChannelById(process.env.TOP_ACTIVE_CHANNEL as string);

        if (channel) {
            const channelInfo = await channel.getInfo();

            if (channelInfo.channelDescription !== buffer) {
                channel.edit({
                    channelDescription: buffer
                });
            }
        }
    });
}

function parseSecondsToString(seconds: number) {
    const numyears = Math.floor(seconds / 31536000);
    const numdays = Math.floor((seconds % 31536000) / 86400); 
    const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    const numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    let buffer = "";

    if (numyears) {
        buffer += (numyears == 1) ? `${numyears} year ` : `${numyears} years `;
    } if (numdays) {
        buffer += (numdays == 1) ? `${numdays} day ` : `${numdays} days `;
    } if (numhours) {
        buffer += (numhours == 1) ? `${numhours} hour ` : `${numhours} hours `;
    } if (numminutes) {
        buffer += (numminutes == 1) ? `${numminutes} minute ` : `${numminutes} minutes `;
    } if (numseconds) {
        buffer += (numseconds == 1) ? `${numseconds} second ` : `${numseconds} seconds `;
    }

    buffer.slice(buffer.length - 2, buffer.length);
    return buffer;
}

export const updateServerStatistics = async () => {
    RankConnection.query("SELECT * FROM `cfg_params` WHERE `param` LIKE BINARY 'rankup_excepted_group_id_list' LIMIT 1", function (error, results, fields) {
        if (error) {
            console.log(error);
            throw Error("MySQL Error");
        }

        if (results == null) {
            ignoreGroups = [];
        }

        const data = results[0].value;
        ignoreGroups = data.split(",");

        updateTopOnline();
        updateTopActive();

        setTimeout(() => {
            updateServerStatistics();
        }, UPDATE_STATISTICS);
    });
};

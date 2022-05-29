import {
	update_interval as UPDATE_INTERVAL,
	servers,
	channel_name,
} from "./config/servers.json";
import { Type, query as gamedigQuery } from "gamedig";
import { Terminal } from "./terminal";
import TSConnection from "./connection";

const terminal = new Terminal();

export const registerCommunityServers = async (): Promise<void> => {
	for (const server of servers) {
		const channel = await TSConnection.getChannelById(
			server.channelid.toString()
		);

		if (!channel) {
			terminal.redLog(
				`Channel ${server.channelid} for server info does not exits.`
			);
			continue;
		}

		let connectedPlayers = 0;
		let maxPlayers = 0;

		try {
			const result = await gamedigQuery({
				host: server.ip,
				port: server.port,
				type: server.type as Type,
			});

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const raw: any = result.raw;
			let desription = "";

			switch (server.type) {
				case "mtasa": {
					if (raw && "numplayers" in raw) {
						connectedPlayers = raw["numplayers"];
					}

					maxPlayers = result.maxplayers;

					desription =
						`[size=9]Hostname: [COLOR=#990000][B]${result.name}[/B][/COLOR]` +
						"\n" +
						`Address: [COLOR=#990000][B]${server.ip}:${server.port}[/B][/COLOR]` +
						"\n" +
						`Players: [COLOR=#990000][B]${connectedPlayers}/${maxPlayers}[/B][/COLOR][/size]`;
					break;
				}
				case "samp": {
					if (raw && "numplayers" in raw) {
						connectedPlayers = raw["numplayers"];
					}

					maxPlayers = result.maxplayers;

					desription =
						`[size=9]Hostname: [COLOR=#990000][B]${result.name}[/B][/COLOR]` +
						"\n" +
						`Address: [COLOR=#990000][B]${server.ip}:${server.port}[/B][/COLOR]` +
						"\n" +
						`Players: [COLOR=#990000][B]${connectedPlayers}/${maxPlayers}[/B][/COLOR][/size]`;
					break;
				}
				case "cs16": {
					if (raw && "numplayers" in raw) {
						connectedPlayers = raw["numplayers"];
					}

					maxPlayers = result.maxplayers;

					desription =
						`[size=9]Hostname: [COLOR=#990000][B]${result.name}[/B][/COLOR]` +
						"\n" +
						`Address: [COLOR=#990000][B]${server.ip}:${server.port}[/B][/COLOR]` +
						"\n" +
						`Players: [COLOR=#990000][B]${connectedPlayers}/${maxPlayers}[/B][/COLOR][/size]`;
					break;
				}
				// case "minecraft": {
				// 	connectedPlayers = result.players.length;
				// 	maxPlayers = result.maxplayers;

				// 	desription =
				// 		`[size=9]Hostname: [COLOR=#990000][B]${result.name}[/B][/COLOR]` +
				// 		"\n" +
				// 		`Address: [COLOR=#990000][B]${server.hub_ip}[/B][/COLOR]` +
				// 		"\n" +
				// 		`Players: [COLOR=#990000][B]${connectedPlayers}/${maxPlayers}[/B][/COLOR][/size]`;
				// 	break;
				// }
				default:
					break;
			}

			const newName = channel_name
				.replace("%gametext%", server.gametext)
				.replace("%gamemode%", server.gamemode)
				.replace("%onlineplayers%", connectedPlayers.toString())
				.replace("%maxplayers%", maxPlayers.toString());

			if (channel.name === newName) {
				continue;
			}

			channel.edit({
				channelName: newName,
				channelDescription:
					desription +
					"\n" +
					"[center][B][size=8][hr]» [COLOR=#990000]Skill Arena[/COLOR] Public TeamSpeak «" +
					"\n" +
					"» Contact: [COLOR=#990000]public@sa-rpg.com[/COLOR] «[hr][/size][/B][/center]",
			});
		} catch (error) {
			const newName = `[cspacer]${server.gametext} • ${server.gamemode} • ${connectedPlayers}/${maxPlayers}`;

			if (channel.name === newName) {
				continue;
			}

			channel.edit({
				channelName: newName,
				channelDescription:
					"[center][B][size=8][hr]» [COLOR=#990000]Skill Arena[/COLOR] Public TeamSpeak «" +
					"\n" +
					"» Contact: [COLOR=#990000]public@sa-rpg.com[/COLOR] «[hr][/size][/B][/center]",
			});

			terminal.redLog(
				`Error querying server, game: ${server.gametext}, game: ${server.gamemode}, (${server.ip}:${server.port})`
			);
		}
	}
	setTimeout(registerCommunityServers, UPDATE_INTERVAL * 1000);
};

import TSConnection from "./connection";
import humanizeDuration from "humanize-duration";
import * as config from "./config/ts_info.json";

const AVG_PING_CHANNEL = config.avg_ping_ch.toString();
const AVG_PACKET_LOSS = config.avg_packet_loss_ch.toString();
const ONLINE_CLIENTS = config.online_clients_ch.toString();
const SERVER_UPTIME = config.server_uptime_ch.toString();

export const queryTSInfo = async (): Promise<void> => {
	const serverInfo = await TSConnection.serverInfo();

	if (AVG_PING_CHANNEL !== "0") {
		const channel = await TSConnection.getChannelById(AVG_PING_CHANNEL);
		const newName = `• Avg. ping: ${serverInfo.virtualserverTotalPing.toFixed(
			1
		)} ms`;

		if (channel && channel.name !== newName) {
			channel.edit({
				channelName: newName,
			});
		}
	}

	if (AVG_PACKET_LOSS !== "0") {
		const channel = await TSConnection.getChannelById(AVG_PACKET_LOSS);
		const newName = `• Total packet loss: ${serverInfo.virtualserverTotalPacketlossTotal}%`;

		if (channel && channel.name !== newName) {
			channel.edit({
				channelName: newName,
			});
		}
	}

	if (ONLINE_CLIENTS !== "0") {
		const channel = await TSConnection.getChannelById(ONLINE_CLIENTS);
		const newName = `• Online clients: ${
			serverInfo.virtualserverClientsonline -
			serverInfo.virtualserverQueryclientsonline
		}/${serverInfo.virtualserverMaxclients}`;

		if (channel && channel.name !== newName) {
			channel.edit({
				channelName: newName,
			});
		}
	}

	if (SERVER_UPTIME !== "0") {
		const channel = await TSConnection.getChannelById(SERVER_UPTIME);

		if (typeof serverInfo.virtualserverUptime !== "number") {
			return;
		}

		const newName = `• Server uptime: ${humanizeDuration(
			serverInfo.virtualserverUptime * 1000,
			{
				largest: 2,
				round: true,
			}
		)}`;

		if (channel && channel.name !== newName) {
			channel.edit({
				channelName: newName,
			});
		}
	}

	setTimeout(queryTSInfo, config.query_interval * 1000);
};

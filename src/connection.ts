import { QueryProtocol, TeamSpeak } from "ts3-nodejs-library";

const ts3 = {
	server_ip: process.env.SERVER_IP,
	server_port: +(process.env.SERVER_PORT as string),
	query_port: +(process.env.QUERY_PORT as string),
	query_username: process.env.QUERY_USERNAME,
	query_password: process.env.QUERY_PASSWORD,
	query_nickname: process.env.QUERY_NICKNAME,
};

const TSConnection = new TeamSpeak({
	host: ts3.server_ip,
	serverport: ts3.server_port,
	protocol: QueryProtocol.RAW,
	queryport: ts3.query_port,
	username: ts3.query_username,
	password: ts3.query_password,
	nickname: ts3.query_nickname,
});

export default TSConnection;

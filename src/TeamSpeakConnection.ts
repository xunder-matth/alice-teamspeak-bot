import { TeamSpeak, QueryProtocol } from 'ts3-nodejs-library';

const TeamSpeakConnection = new TeamSpeak({
    host: process.env.TS3_HOST as string,
    protocol: QueryProtocol.RAW,
    queryport: parseInt(process.env.TS3_QUERY_PORT as string, 10),
    serverport: parseInt(process.env.TS3_PORT as string, 10),
    username: process.env.TS3_QUERY_NAME as string,
    password: process.env.TS3_QUERY_PASSWORD as string,
    nickname: 'Alice'
});

export default TeamSpeakConnection;

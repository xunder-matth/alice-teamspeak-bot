import TeamSpeakConnection from '../TeamSpeakConnection';

const UPDATE_ONLINE_CLIENTS = parseInt(process.env.UPDATE_ONLINE_CLIENTS as string);
const UPDATE_SERVER_UPTIME = parseInt(process.env.UPDATE_SERVER_UPTIME as string);
const UPDATE_PACKET_LOSS = parseInt(process.env.UPDATE_PACKET_LOSS as string);
const UPDATE_PING = parseInt(process.env.UPDATE_PING as string);

async function updateOnlineClients() {
    const channel = await TeamSpeakConnection.getChannelById(process.env.ONLINE_CLIENTS_CHANNEL as string);
    const server = await TeamSpeakConnection.serverInfo();

    if (channel) {
        const newName = `• Online clients: ${server.virtualserverClientsonline - server.virtualserverQueryclientsonline}/${server.virtualserverMaxclients}`;

        if (channel.name !== newName) {
            channel.edit({
                channelName: newName
            });
        }
    }

    setTimeout(function() { 
        updateOnlineClients();
    }, UPDATE_ONLINE_CLIENTS);
}

async function updateServerUptime() {
    const channel = await TeamSpeakConnection.getChannelById(process.env.SERVER_UPTIME_CHANNEL as string);
    const connection = await TeamSpeakConnection.connectionInfo();

    if (channel) {
        const newName = `• Server uptime: ${parseUptimeToString(connection.connectionConnectedTime)}`;

        if (channel.name !== newName) {
            channel.edit({
                channelName: newName
            });
        }
    }

    setTimeout(function() { 
        updateServerUptime();
    }, UPDATE_SERVER_UPTIME);
}

async function updateAvgPacketLoss() {
    const channel = await TeamSpeakConnection.getChannelById(process.env.PACKET_LOSS_CHANNEL as string);
    const connection = await TeamSpeakConnection.connectionInfo();

    if (channel) {
        const newName = `• Avg. packetloss: ${connection.connectionPacketlossTotal.toFixed(1)}%`;

        if (channel.name !== newName) {
            channel.edit({
                channelName: newName
            });
        }
    }

    setTimeout(function() { 
        updateAvgPacketLoss();
    }, UPDATE_PACKET_LOSS);
}

async function updateAvgPing() {
    const channel = await TeamSpeakConnection.getChannelById(process.env.PING_CHANNEL as string);
    const connection = await TeamSpeakConnection.connectionInfo();

    if (channel) {
        const newName = `• Avg. ping: ${connection.connectionPing.toFixed(1)} ms`;

        if (channel.name !== newName) {
            channel.edit({
                channelName: newName
            });
        }
    }

    setTimeout(function() { 
        updateAvgPing();
    }, UPDATE_PING);
}

function parseUptimeToString(seconds: number) {
    const numdays = Math.floor((seconds) / 86400); 
    const numhours = Math.floor((seconds % 86400) / 3600);
    return `${numdays} days ${numhours} hours`;
}

export const updateServerInfo = async () => {
    updateOnlineClients();
    updateServerUptime();
    updateAvgPacketLoss();
    updateAvgPing();
};

import { ClientType } from 'ts3-nodejs-library';
import { ClientMoved } from 'ts3-nodejs-library/lib/types/Events';
import TeamSpeakConnection from '../TeamSpeakConnection';
import { isAdministrativeGroup, isSupporter } from '../utils/helpers';
import logger from '../utils/logger';

const notifyOnWaitingForSupport = async (event: ClientMoved) => {
    try {
        const waitingForPermission = process.env.REQUEST_FOR_PERMISSION_CHANNEL as string;
        const waitingForHelp = process.env.REQUEST_FOR_HELP_CHANNEL as string;

        if (
            ![waitingForPermission, waitingForHelp].includes(
                event.channel.cid
            )
        ) {
            return;
        }

        if (isSupporter(event.client) || isAdministrativeGroup(event.client)) {
            return;
        }

        const clients = await TeamSpeakConnection.clientList({
            clientType: ClientType.Regular,
        });

        const clientsToNotify = clients.filter((client) => {
            if (event.channel.cid === waitingForPermission || event.channel.cid === waitingForHelp) {
                return isSupporter(client);
            }
        });

        clientsToNotify.forEach((clientToNotify) => {
            clientToNotify.message(
                `✋ [URL=client://${event.client.clid}/${event.client.uniqueIdentifier}]${event.client.nickname}[/URL] čeka Supportera.`
            );
        });
    } catch (err) {
        logger.log('Error in notifyOnWaitingForSupport', err);
    }
};

export const registerWaitingForSupportNotify = () => {
    TeamSpeakConnection.on('clientmoved', notifyOnWaitingForSupport);
};

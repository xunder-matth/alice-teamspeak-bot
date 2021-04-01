import TeamSpeakConnection from '../TeamSpeakConnection';
import { ClientConnect } from 'ts3-nodejs-library/lib/types/Events';
import { ClientType } from 'ts3-nodejs-library';

const registerClient = async (event: ClientConnect) => {
    try {
        const client = event.client;

        if (client.type !== ClientType.Regular) {
            return;
        }

        
    } catch (err) {
        throw Error("Error occured in registerClient.");
    }
};

export const registerOnConnect = () => {
    TeamSpeakConnection.on('clientconnect', registerClient);
};

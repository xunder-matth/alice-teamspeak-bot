import TeamSpeakConnection from '../TeamSpeakConnection';
import { ClientConnect } from 'ts3-nodejs-library/lib/types/Events';
import { ClientType } from 'ts3-nodejs-library';
import logger from '../utils/logger';

const welcomeClient = async (event: ClientConnect) => {
    try {
        if (event.client.type !== ClientType.Regular) {
            return;
        }

        event.client.message(
`Dobrodosao [color=#990000][b]${event.client.nickname}[/b][/color] na [color=#990000][b]Skill Arena Community TeamSpeak[/b][/color]. 👋

Forum: [url=https://sa-rpg.com/forum][color=#990000][b]https://sa-rpg.com/forum[/b][/color][/url]
Web site: [url=http://gaming.sa-rpg.com/teamspeak][color=#990000][b]http://gaming.sa-rpg.com/teamspeak[/b][/color][/url]
Rank system: [url=http://gaming.sa-rpg.com/ranksys/stats][color=#990000][b]http://gaming.sa-rpg.com/ranksys/stats[/b][/color][/url]

Group assigner: [url=http://gaming.sa-rpg.com/teamspeak/assigner.php][color=#990000][b]http://gaming.sa-rpg.com/teamspeak/assigner.php[/b][/color][/url]`
        );
    } catch (err) {
        logger.log('Error in welcomeClient', err);
    }
};

export const registerWelcomer = () => {
    TeamSpeakConnection.on('clientconnect', welcomeClient);
};

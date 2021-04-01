import { TeamSpeakClient } from 'ts3-nodejs-library';
import path from "path";

export const isSupporter = (client: TeamSpeakClient) => {
    const supporterGroupId = process.env.SUPPORTER_GROUP as string;

    return client.servergroups.includes(supporterGroupId);
};

export const isAdministrator = (client: TeamSpeakClient) => {
    const administratorGroupId = process.env.ADMINISTRATOR_GROUP as string;

    return client.servergroups.includes(administratorGroupId);
};

export const isAdminQuery = (client: TeamSpeakClient) => {
    const adminQueryGroupId = process.env.ADMIN_QUERY_GROUP as string;

    return client.servergroups.includes(adminQueryGroupId);
};

export const isAdministrativeGroup = (client: TeamSpeakClient) => {
    if (isAdministrator(client) || isAdminQuery(client)) {
        return true;
    }
    return false;
}

export const getRootDir = () => {
    return path.join(__dirname.replace("/utils", "/"));
};

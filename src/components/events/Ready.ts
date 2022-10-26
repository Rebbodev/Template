import { BotClient } from '../..';
import { DiscordEvent } from '../../types/componentTypes';
import L_globalDelays from '../../util/data/legacy-delays/global.json';
import L_userDelays from '../../util/data/legacy-delays/user.json';

export const globalLegacyDelays: { [key: string]: number } | object =
    L_globalDelays;
export const userLegacyDelays: { [key: string]: number } | object =
    L_userDelays;

export const E_Ready: DiscordEvent = {
    event: 'ready',
    run: async () => {
        console.log(`${BotClient.user?.username} is now online`);
    },
};

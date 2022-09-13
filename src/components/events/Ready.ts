import { BotClient } from '../..';
import { DiscordEvent } from '../../types/componentTypes';

export const E_Ready: DiscordEvent = {
    event: 'ready',
    run: async () => {
        console.log(`${BotClient.user?.username} is now online`);
    },
};

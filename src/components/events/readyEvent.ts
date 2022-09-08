import { DiscordEvent } from '../../types/componentTypes';

export const ReadyEvent: DiscordEvent = {
    event: 'ready',
    run: async () => {
        console.log('Discord client ready!');
    },
};

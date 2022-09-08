import { BotClient } from '../..';
import { DiscordEventsRaw } from '../../components/RawCollecter';

export const EventsLoop = () => {
    console.log('Loading in events...');

    for (const event of DiscordEventsRaw) {
        BotClient.on(event.event, event.run);
    }
};

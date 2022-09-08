import {
    DiscordEvent,
    LegacyCommand,
    SlashCommand,
} from '../types/componentTypes';
//Events and Commands
import { ReadyEvent } from './events/readyEvent';

export const SlashCommandsRaw: SlashCommand[] = [];
export const DiscordEventsRaw: DiscordEvent[] = [ReadyEvent];
export const LegacyCommandsRaw: LegacyCommand[] = [];

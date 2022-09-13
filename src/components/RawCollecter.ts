import { E_LegacyCommandListner } from '../core/Handler/LegacyCommands';
import {
    E_SlashCommandHandler,
    E_SlashCommandListner,
} from '../core/Handler/SlashCommands';
import { DiscordEvent, SlashCommand } from '../types/componentTypes';
import { E_Ready } from './events/Ready';
//Events and Commands

export const SlashCommandsRaw: SlashCommand[] = [];
export const DiscordEventsRaw: DiscordEvent[] = [
    E_Ready,
    E_LegacyCommandListner,
    E_SlashCommandListner,
    E_SlashCommandHandler,
];

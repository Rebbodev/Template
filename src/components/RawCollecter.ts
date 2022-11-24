import { E_LegacyCommandListner } from '../core/Handler/LegacyCommands';
import {
    E_SlashCommandHandler,
    E_SlashCommandListner,
} from '../core/Handler/SlashCommands';
import { DiscordEvent, SlashCommand } from '../types/componentTypes';
import { LegacyCommandsManager } from '../util/functions/LegacyCMDS';
import { L_helpCommand } from './commands/help';
import { S_textCommand } from './commands/text';
import { E_Ready } from './events/Ready';
//Events and Commands

export const SlashCommandsRaw: SlashCommand[] = [S_textCommand];
export const DiscordEventsRaw: DiscordEvent[] = [
    E_Ready,
    E_LegacyCommandListner,
    E_SlashCommandListner,
    E_SlashCommandHandler,
];

export const legacyCommandRaw = new LegacyCommandsManager([L_helpCommand]);

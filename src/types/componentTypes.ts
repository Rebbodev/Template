/* eslint-disable unused-imports/no-unused-vars */
import {
    ChatInputApplicationCommandData,
    ClientEvents,
    Interaction,
    Message,
} from 'discord.js';

export type SlashCommand = {
    data: ChatInputApplicationCommandData;
    kill?: boolean;
    update: boolean;
    requiredRoles?: { roles: string[]; admin: boolean };
    guildOnly: boolean;
    run: (interaction: Interaction) => Promise<any>;
};

export type DiscordEvent = {
    event: keyof ClientEvents;
    run: (...arguments_: any[]) => Promise<void>;
};

export type LegacyCommand = {
    name: string;
    description: string;
    category?: string;
    syntax?: string;
    requiredRoles?: { roles: string[]; admin?: boolean };
    run: (message: Message, arguments_: string[]) => Promise<any>;
};

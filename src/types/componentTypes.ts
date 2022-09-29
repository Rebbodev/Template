/* eslint-disable unused-imports/no-unused-vars */
import {
    ChatInputApplicationCommandData,
    ClientEvents,
    Interaction,
    Message,
    PermissionResolvable,
} from 'discord.js';

export type SlashCommand = {
    data: ChatInputApplicationCommandData;
    kill?: boolean;
    update: boolean;
    requiredRoles?: { roles: string[]; admin?: boolean };
    guildOnly: boolean;
    delay?: { delay: number; gloabl: boolean };
    developerMode?: boolean;
    run: (interaction: Interaction) => Promise<any>;
};

export type DiscordEvent = {
    event: keyof ClientEvents;
    run: (...arguments_: any[]) => Promise<void>;
};

30;
export type LegacyCommand = {
    name: string;
    description: string;
    category?: string;
    syntax?: string;
    requiredRoles?: { roles: string[]; admin?: boolean; allRoles?: boolean };
    permission?: PermissionResolvable[];
    delay?: { delay: number; gloabl: boolean };
    doNotRegister?: boolean;
    developerMode?: boolean;
    run: (message: Message, arguments_: string[]) => Promise<any>;
};

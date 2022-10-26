import { ChatInputApplicationCommandData, Interaction } from 'discord.js';

import { SlashCommand } from '../../../types/componentTypes';

export function SlashBuilder(
    data: ChatInputApplicationCommandData,
    settings: {
        kill?: boolean;
        update: boolean;
        requiredRoles?: { roles: string[]; admin?: boolean };
        guildOnly: boolean;
        cooldown?: { delay: number; gloabl: boolean };
        developerMode?: boolean;
    },
    // eslint-disable-next-line unused-imports/no-unused-vars
    run: (interaction: Interaction) => Promise<any>
) {
    const newObject: SlashCommand = { data, ...settings, run };

    return newObject;
}

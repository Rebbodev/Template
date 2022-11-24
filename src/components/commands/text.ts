import { Interaction } from 'discord.js';

import { SlashBuilder } from '../../util/functions/Slash-Commands/dataBuilder';

export const S_textCommand = SlashBuilder(
    { name: 'text', description: 'text test command' },
    {
        cooldown: { delay: 20000, gloabl: true },
        guildOnly: false,
        update: false,
    },
    async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;

        interaction.reply('test');
    }
);

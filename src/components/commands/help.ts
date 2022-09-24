import {
    ActionRowBuilder,
    APIEmbedField,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    RestOrArray,
} from 'discord.js';

import { BotClient } from '../..';
import { LegacyBuilder } from '../../util/functions/LegacyCMDS';
import { legacyCommandRaw } from '../RawCollecter';

export const L_helpCommand = LegacyBuilder(
    'help',
    {
        description: 'App help menu',
        syntax: '{category name}',
        delay: { delay: 2000, gloabl: false },
    },
    async (message, arguments_) => {
        const helpEmbed = new EmbedBuilder()
            .setAuthor({
                name: `${BotClient.user?.username} Help Menu!`,
                iconURL: BotClient.user?.displayAvatarURL(),
            })
            .setColor('#303434');

        const fieldsObject: RestOrArray<APIEmbedField> = [];

        let index = 0;

        for (const category in legacyCommandRaw.helpMenu()) {
            const newString = `\`{PREFIX}help ${category.toLocaleLowerCase()}\``;

            if (index++)
                fieldsObject.push({
                    name: '\u200B',
                    value: '\u200B',
                    inline: true,
                });

            fieldsObject.push({
                name: category.toLocaleUpperCase(),
                value: newString.toLocaleLowerCase(),
                inline: true,
            });

            index++;
        }

        if (!arguments_.at(0)) helpEmbed.addFields(fieldsObject);

        if (arguments_.at(0)) {
            const category: string = arguments_.at(0)?.toLocaleLowerCase()!;

            const object: any = legacyCommandRaw.helpMenu();

            const findCategory: object = object[category];

            if (findCategory) {
                helpEmbed.setDescription(object[category]);
            } else {
                helpEmbed.addFields(fieldsObject);
            }
        }

        const mainMenuButton =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel('Main Menu')
                    .setCustomId('help_menu_main')
            );

        message.reply({ embeds: [helpEmbed], components: [mainMenuButton] });
    }
);

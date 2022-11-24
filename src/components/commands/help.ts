/* eslint-disable unicorn/prefer-at */
/* eslint-disable unicorn/numeric-separators-style */
import {
    ActionRowBuilder,
    APIEmbedField,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    RestOrArray,
} from 'discord.js';

import { BotClient, GLOBALS } from '../..';
import { LegacyBuilder } from '../../util/functions/LegacyCMDS';
import { legacyCommandRaw } from '../RawCollecter';

export const L_helpCommand = LegacyBuilder(
    'help',
    {
        description: 'Help command',
        syntax: '[category]',
        category: 'Help',
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

        console.log(legacyCommandRaw.helpMenu());

        for (const category in legacyCommandRaw.helpMenu()) {
            const newString = `\`${
                GLOBALS.Prefix
            }help ${category.toLocaleLowerCase()}\``;

            if (index % 2 !== 0)
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

        let embedObject = {};

        if (arguments_[0]) {
            const category: string = arguments_.at(0)?.toLocaleLowerCase()!;

            const object: any = legacyCommandRaw.helpMenu();

            const findCategory: object = object[category];

            const mainMenuButton =
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setLabel('Main Menu')
                        .setCustomId('help_menu_main')
                );

            if (findCategory) {
                helpEmbed.setDescription(object[category]);
                embedObject = {
                    embeds: [helpEmbed],
                    components: [mainMenuButton],
                };
            } else {
                helpEmbed.addFields(fieldsObject);
                embedObject = {
                    embeds: [helpEmbed],
                };
            }
        } else {
            helpEmbed.addFields(fieldsObject);
            embedObject = {
                embeds: [helpEmbed],
            };
        }

        message.channel.send(embedObject);
    }
);

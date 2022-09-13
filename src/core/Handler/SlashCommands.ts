import { red } from 'colorette';
import { EmbedBuilder, Guild, Interaction } from 'discord.js';

import { BotClient } from '../..';
import { SlashCommandsRaw } from '../../components/RawCollecter';
import { DiscordEvent, SlashCommand } from '../../types/componentTypes';
import { ScEnabled, ScGuilds } from '../../util/data/settings.json';
import {
    GuildCommand,
    SlashCommand as SlashCommandClass,
} from '../../util/functions/Classes';

export const SlashCommands: {
    [key: string]: SlashCommand;
} = {};
//Creating and deleteing commands
export const E_SlashCommandHandler: DiscordEvent = {
    event: 'ready',
    // eslint-disable-next-line sonarjs/cognitive-complexity
    run: async () => {
        if (!ScEnabled) return;

        const guilds: Guild[] = [];

        for (const guildId of ScGuilds) {
            const guild = BotClient.guilds.cache.get(guildId);

            if (!guild) {
                throw new Error(
                    `The guild "${red(
                        guildId
                    )}" was not found if it doesnt now exist please remove it from settings!`
                );
            } else {
                guilds.push(guild);
            }
        }

        for (const cmd of SlashCommandsRaw) {
            const Command = cmd.guildOnly
                ? new GuildCommand(guilds)
                : new SlashCommandClass(guilds);

            SlashCommands[cmd.data.name.toLowerCase()] = cmd;

            const { data, kill, update } = cmd;
            const { name } = data;

            if (!kill) {
                await Command.create(name, data);
            } else if (kill) {
                await Command.delete(name);
            } else if (update) {
                await Command.edit(name, data);
            }
        }

        for (const guildId of ScGuilds) {
            const guild = BotClient.guilds.cache.get(guildId);
            const Commands = await guild?.commands.fetch();

            const Command = new GuildCommand(guilds);

            if (Commands) {
                // eslint-disable-next-line unicorn/no-array-for-each
                Commands.forEach(async (command) => {
                    if (!SlashCommands[command.name]) {
                        Command.delete(command.name);
                    }
                });
            }
        }

        const AppCommands = await BotClient.application?.commands.fetch();

        // eslint-disable-next-line unicorn/no-array-for-each
        AppCommands?.forEach(async (command) => {
            const Command = new SlashCommandClass(guilds);

            if (!SlashCommands[command.name]) {
                Command.delete(command.name);
            }
        });
    },
};

export const E_SlashCommandListner: DiscordEvent = {
    event: 'interactionCreate',
    run: async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const cmd = SlashCommands[interaction.commandName.toLowerCase()];

        const cmdNotFound = new EmbedBuilder()
            .setColor('#303434')
            .setDescription(
                'Sorry but the command this command is not available!'
            );

        if (!cmd) {
            await interaction.reply({
                embeds: [cmdNotFound],
                ephemeral: true,
            });

            return;
        }

        await cmd.run(interaction);
    },
};

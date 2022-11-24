import { red } from 'colorette';
import { EmbedBuilder, Guild, Interaction } from 'discord.js';

import { BotClient, GLOBALS } from '../..';
import { SlashCommandsRaw } from '../../components/RawCollecter';
import { DiscordEvent, SlashCommand } from '../../types/componentTypes';
import {
    GuildCommand,
    SlashCommand as SlashCommandClass,
} from '../../util/functions/Slash-Commands/manager';
import { SlashRulesArray } from './Rules/SlashRules';

export const SlashCommands: {
    [key: string]: SlashCommand;
} = {};
//Creating and deleteing commands
export const E_SlashCommandHandler: DiscordEvent = {
    event: 'ready',
    // eslint-disable-next-line sonarjs/cognitive-complexity
    run: async () => {
        const { ScEnabled, ScGuilds } = GLOBALS;

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

        // Creates, deletes and edits commands
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

        // Checks if all registered guild commands are actually available in the file if not it will remove them
        for (const guildId of ScGuilds) {
            const guild = BotClient.guilds.cache.get(guildId);

            if (guild) {
                const commands = await guild.commands.fetch();

                commands.map((cmd) => {
                    const findCmd = SlashCommands[cmd.name];

                    if (!findCmd || !findCmd.guildOnly) {
                        guild.commands.delete(cmd.id);
                    }
                });
            }
        }

        const AppCommands = await BotClient.application?.commands.fetch();

        // eslint-disable-next-line unicorn/no-array-for-each
        AppCommands?.forEach(async (command) => {
            const Command = new SlashCommandClass(guilds);

            const cmd = SlashCommands[command.name];

            if (!cmd || cmd.guildOnly) {
                Command.delete(command.name);
            }
        });

        if (!ScEnabled) {
            for (const guildId of ScGuilds) {
                const guild = BotClient.guilds.cache.get(guildId);

                if (guild) {
                    const commands = await guild.commands.fetch();

                    commands.map((cmd) => {
                        guild.commands.delete(cmd.id);
                    });
                }
            }

            const AppCommands = await BotClient.application?.commands.fetch();

            // eslint-disable-next-line unicorn/no-array-for-each
            AppCommands?.map((command) => {
                const Command = new SlashCommandClass(guilds);

                Command.delete(command.name);
            });
        }
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

        let Permission = true;

        for (const rule of SlashRulesArray) {
            const call = rule.run(interaction, cmd);

            if (!call) Permission = false;
        }

        if (!Permission) return;

        await cmd.run(interaction);
    },
};

import { red } from 'colorette';
import { Guild } from 'discord.js';

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
export const SlashCommandHandler: DiscordEvent = {
    event: 'ready',
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

            SlashCommands[cmd.data.name] = cmd;

            Command.create(cmd.data.name, cmd.data);
        }
    },
};

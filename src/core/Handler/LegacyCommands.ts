import { Message } from 'discord.js';

import { DiscordEvent, LegacyCommand } from '../../types/componentTypes';
import { LcEnabled, Prefix } from '../../util/data/settings.json';
import { LegacyRules } from './Rules/LegacyRules';

export const LegacyCommands: {
    [key: string]: LegacyCommand;
} = {};

export const helpMenu: {
    [key: string]: string;
} = {};

export const LegacyCommandsRaw: LegacyCommand[] = [];

// eslint-disable-next-line sonarjs/no-empty-collection
for (const cmd of LegacyCommandsRaw) {
    LegacyCommands[cmd.name] = cmd;

    const syntax = cmd.syntax ? ` ${cmd.syntax}` : '';

    const CommandLine = `\`${Prefix}${cmd.name}${syntax}\`\n${cmd.description}\n\n'`;

    if (cmd.category) {
        const Category = helpMenu[cmd.category];

        if (Category) {
            helpMenu[cmd.category] += CommandLine;
        } else {
            helpMenu[cmd.category] = CommandLine;
        }
    }
}

export const E_LegacyCommandListner: DiscordEvent = {
    event: 'messageCreate',
    run: async (message: Message) => {
        if (
            !LcEnabled ||
            !message.content.toLowerCase().startsWith(Prefix.toLowerCase())
        )
            return;

        const splitContent: string[] | string = message.content.split(' ');
        const commandName = (splitContent.at(0) || '')
            .slice(Prefix.length)
            .toLowerCase();

        const arguments_ = splitContent.slice(1);

        const cmd = LegacyCommands[commandName];

        if (!cmd) return;

        let Permission = true;

        for (const rule of LegacyRules) {
            const call = rule.run(message, cmd);

            if (!call) Permission = false;
        }

        if (!Permission) return;

        await cmd.run(message, arguments_);
    },
};

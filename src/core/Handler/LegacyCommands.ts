import { Message } from 'discord.js';

import { GLOBALS } from '../..';
import { legacyCommandRaw } from '../../components/RawCollecter';
import { DiscordEvent } from '../../types/componentTypes';
import { LegacyRulesArray } from './Rules/LegacyRules';

// eslint-disable-next-line sonarjs/no-empty-collection

export const E_LegacyCommandListner: DiscordEvent = {
    event: 'messageCreate',
    run: async (message: Message) => {
        const { Prefix, LcEnabled } = GLOBALS;

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

        const cmd = legacyCommandRaw.getCmds()[commandName];

        if (!cmd) return;

        let Permission = true;

        for (const rule of LegacyRulesArray) {
            const call = rule.run(message, cmd);

            if (!call) Permission = false;
        }

        if (!Permission) return;

        await cmd.run(message, arguments_);
    },
};

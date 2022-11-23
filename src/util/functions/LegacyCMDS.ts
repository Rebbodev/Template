import { Message, PermissionResolvable } from 'discord.js';

import { GLOBALS } from '../..';
import { LegacyCommand } from '../../types/componentTypes';

export function LegacyBuilder(
    name: string,
    data: {
        description: string;
        category?: string;
        syntax?: string;
        requiredRoles?: {
            roles: string[];
            admin?: boolean;
            allRoles?: boolean;
        };
        permission?: PermissionResolvable[];
        cooldown?: { delay: number; gloabl: boolean };
        doNotRegister?: boolean;
        developerMode?: boolean;
    },
    // eslint-disable-next-line unused-imports/no-unused-vars
    run: (message: Message, arguments_: string[]) => Promise<any>
): LegacyCommand {
    const cmd: LegacyCommand = { name, ...data, run };

    return cmd;
}

export class LegacyCommandsManager {
    constructor(public commands: LegacyCommand[]) {
        this.commands = commands;
    }

    getCmds() {
        const commandsObject: { [key: string]: LegacyCommand } = {};

        for (const command of this.commands) {
            if (!command.doNotRegister) commandsObject[command.name] = command;
        }

        return commandsObject;
    }

    helpMenu(ignore?: string[]): object {
        const helpCategory: { [key: string]: string } = {};

        for (const cmd of this.commands) {
            const syntaxString = cmd.syntax ? ` ${cmd.syntax}` : '';
            const newString = `\`${GLOBALS.Prefix}${cmd.name}${syntaxString}\`\n*${cmd.description}*\n\n`;

            if (
                cmd.category &&
                !cmd.doNotRegister &&
                !cmd.developerMode &&
                ((ignore && !ignore.includes(cmd.category)) || !ignore)
            ) {
                const Category = helpCategory[cmd.category.toLocaleLowerCase()];

                if (Category) {
                    helpCategory[cmd.category.toLocaleLowerCase()] += newString;
                } else {
                    helpCategory[cmd.category.toLocaleLowerCase()] = newString;
                }
            }
        }

        return helpCategory;
    }
}

import { Message, PermissionResolvable } from 'discord.js';

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
        permission?: PermissionResolvable;
        delay?: { delay: number; gloabl: boolean };
        doNotRegister?: boolean;
        developerMode?: boolean;
    },
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
}

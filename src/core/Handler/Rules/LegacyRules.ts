import { EmbedBuilder, Message } from 'discord.js';

import { LegacyCommand } from '../../../types/componentTypes';
import L_globalDelays from './../../../util/data/legacy-delays/global.json';
import L_userDelays from './../../../util/data/legacy-delays/user.json';

export const globalLegacyDelays: { [key: string]: number } | object =
    L_globalDelays;
export const userLegacyDelays: { [key: string]: number } | object =
    L_userDelays;

export type LegacyRules = {
    ruleName: string;
    // eslint-disable-next-line unused-imports/no-unused-vars
    run: (message: Message, cmd: LegacyCommand) => boolean;
};

export const LegacyRolesRequired: LegacyRules = {
    ruleName: 'Required Roles',
    run: (message: Message, cmd: LegacyCommand) => {
        if (!cmd.requiredRoles) return true;

        const { roles, allRoles, admin } = cmd.requiredRoles;

        const checkType = allRoles
            ? message.member?.roles.cache.hasAll(...roles)
            : message.member?.roles.cache.hasAny(...roles);

        const Grant = !(
            (!checkType && !admin) ||
            (!checkType &&
                admin &&
                !message.member?.permissions.has('Administrator'))
        );

        if (!Grant) {
            const RoleBuild = roles
                .map((index) => '<&' + index + '>')
                .join(', ');
            const errorString = allRoles
                ? `Hey! You need all of ${RoleBuild} to use this command!`
                : `Hey! You need at least one of ${RoleBuild} to use this command!`;

            const ErrorEmbed = new EmbedBuilder()
                .setDescription(errorString)
                .setColor('#303434');

            message.reply({ embeds: [ErrorEmbed] });
        }

        return Grant;
    },
};

const LR_PermissionRequired: LegacyRules = {
    ruleName: 'Permission Required',
    run: (message: Message, cmd: LegacyCommand) => {
        if (!cmd.permission) return true;

        const firstCheck = message.member?.permissions.has(cmd.permission);
        const secondCheck = message.member?.permissions.has('Administrator');

        const Grant = !(!firstCheck && !secondCheck);

        if (!Grant) {
            const errorString = `Hey! You need the permissions ${cmd.permission.join(
                ', '
            )} to use this command!`;

            const errorEmbed = new EmbedBuilder()
                .setColor('#303434')
                .setDescription(errorString);

            message.channel.send({ embeds: [errorEmbed] });
        }

        return Grant;
    },
};

// const LR_Delays: LegacyRules = {
//     ruleName: 'Command Delays',
//     run: (message: Message, cmd: LegacyCommand) => {
//         if (!cmd.delay) return true;
//     },
// };

export const LegacyRulesArray: LegacyRules[] = [
    LegacyRolesRequired,
    LR_PermissionRequired,
    // LR_Delays,
];

import { EmbedBuilder, Message } from 'discord.js';

import { LegacyCommand } from '../../../types/componentTypes';

export type leacyRules = {
    ruleName: string;
    // eslint-disable-next-line unused-imports/no-unused-vars
    run: (message: Message, cmd: LegacyCommand) => boolean;
};

export const LegacyRolesRequired: leacyRules = {
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

export const LegacyRules: leacyRules[] = [LegacyRolesRequired];

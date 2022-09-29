import { EmbedBuilder, Message } from 'discord.js';
import { writeFileSync } from 'node:fs';

import { LegacyCommand } from '../../../types/componentTypes';
import { JsonData } from '../../../util/functions/jsonData';

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

const LR_Delays: LegacyRules = {
    ruleName: 'Command Delays',
    run: (message: Message, cmd: LegacyCommand) => {
        if (!cmd.delay) return true;

        const { delay, gloabl } = cmd.delay;

        const DelayData = new JsonData('/src/util/data/delays.json');
        const mainData: any = DelayData.getAll();

        const getData = DelayData.getOne('legacy');
        const delayType: { type: string; dataName: string } = gloabl
            ? { type: 'global', dataName: cmd.name }
            : {
                  type: 'perUser',
                  dataName: `${message.member?.user.id}_${cmd.name}`,
              };
        const findDataType = getData[delayType.type];
        const findData = findDataType[delayType.dataName];
        let Grant = false;
        const time = Date.now() + delay;
        const errorString = `This command is on cooldown and can be used again in ${
            time - Date.now()
        }`;
        const errorEmbed = new EmbedBuilder().setDescription(errorString);

        if (!findDataType) {
            mainData[delayType.type] = {};
            mainData[delayType.type][delayType.dataName] = time;
        } else if (findDataType && !findData) {
            mainData[delayType.type][delayType.dataName] = time;
        } else if (findDataType && findData && findData - Date.now() <= 0) {
            mainData[delayType.type][delayType.dataName] = time;
            Grant = true;
        }

        writeFileSync(
            process.cwd() + '/src/util/data/delays.json',
            JSON.stringify(mainData)
        );

        if (!Grant) message.reply({ embeds: [errorEmbed] });

        return Grant;
    },
};

export const LegacyRulesArray: LegacyRules[] = [
    LegacyRolesRequired,
    LR_PermissionRequired,
    LR_Delays,
];

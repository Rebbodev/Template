import { EmbedBuilder, Interaction } from 'discord.js';
import ms from 'ms';

import { GLOBALS } from '../../..';
import { SlashCommand } from '../../../types/componentTypes';
import S_globalDelays from './../../../util/data/slash-delays/global.json';
import S_userDelays from './../../../util/data/slash-delays/user.json';

export const globalSlashDelays: { [key: string]: number } = S_globalDelays;
export const userSlashDelays: { [key: string]: number } = S_userDelays;

export type SlashRules = {
    ruleName: string;
    // eslint-disable-next-line unused-imports/no-unused-vars
    run: (interaction: Interaction, cmd: SlashCommand) => boolean;
};

const SR_RequiredRoles: SlashRules = {
    ruleName: 'Required Roles',
    run: (interaction: Interaction, cmd: SlashCommand) => {
        if (
            !cmd.requiredRoles ||
            (cmd.requiredRoles && cmd.requiredRoles.admin)
        )
            return true;

        if (!interaction.inCachedGuild()) return false;

        const { allRoles, roles } = cmd.requiredRoles;

        const Grant = allRoles
            ? interaction.member?.roles.cache.hasAll(...roles)
            : interaction.member.roles.cache.hasAny(...roles);

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

            if (!interaction.isChatInputCommand()) return false;

            interaction.reply({ embeds: [ErrorEmbed] });
        }

        return Grant;
    },
};

const SR_DeveloperMode: SlashRules = {
    ruleName: 'Developer Only',
    run: (interaction: Interaction, cmd: SlashCommand) => {
        if (!cmd.developerMode) return true;

        const Grant = interaction.member?.user.id === GLOBALS.DevId;

        if (!Grant) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#303434')
                .setDescription('This command is in developer only mode!');

            interaction.channel?.send({ embeds: [errorEmbed] });
        }

        return Grant;
    },
};

const SR_DelaysGlobal: SlashRules = {
    ruleName: 'Command Delays',
    run: (interaction: Interaction, cmd: SlashCommand) => {
        if (!cmd.cooldown?.gloabl) return true;

        let Grant = false;

        const callDelayData = globalSlashDelays[cmd.data.name];

        if (!callDelayData) {
            Grant = true;
            globalSlashDelays[cmd.data.name] = Date.now() + cmd.cooldown.delay;
        } else if (callDelayData) {
            if (callDelayData - Date.now() <= 0) {
                Grant = true;
                globalSlashDelays[cmd.data.name] =
                    Date.now() + cmd.cooldown.delay;
            } else {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#303434')
                    .setDescription(
                        `Hey! This command is on cooldown. It will be available in ${ms(
                            callDelayData - Date.now(),
                            { long: true }
                        )}}`
                    );

                if (!interaction.isChatInputCommand()) return false;

                interaction.reply({ embeds: [errorEmbed] });
            }
        }

        return Grant;
    },
};

const SR_DelaysUser: SlashRules = {
    ruleName: 'Command Delays',
    run: (interaction: Interaction, cmd: SlashCommand) => {
        if (!cmd.cooldown || cmd.cooldown?.gloabl) return true;

        let Grant = false;

        const callDelayData =
            userSlashDelays[`${interaction.member?.user.id}_${cmd.data.name}`];

        if (!callDelayData) {
            Grant = true;
            userSlashDelays[`${interaction.member?.user.id}_${cmd.data.name}`] =
                Date.now() + cmd.cooldown.delay;
        } else if (callDelayData) {
            if (callDelayData - Date.now() <= 0) {
                Grant = true;
                userSlashDelays[
                    `${interaction.member?.user.id}_${cmd.data.name}`
                ] = Date.now() + cmd.cooldown.delay;
            } else {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#303434')
                    .setDescription(
                        `Hey! This command is on cooldown. It will be available in ${ms(
                            callDelayData - Date.now(),
                            { long: true }
                        )}`
                    );

                if (!interaction.isChatInputCommand()) return false;

                interaction.reply({ embeds: [errorEmbed] });
            }
        }

        return Grant;
    },
};

export const SlashRulesArray: SlashRules[] = [
    SR_DelaysGlobal,
    SR_DelaysUser,
    SR_DeveloperMode,
    SR_RequiredRoles,
];

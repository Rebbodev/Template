import { ChatInputApplicationCommandData, Guild } from 'discord.js';

import { BotClient } from '../..';

const noGuild = 'No guilds were provided for commands to be registered!';

export class SlashCommand {
    constructor(public guild?: Guild[]) {
        this.guild = guild;
    }

    create(name: string, data: ChatInputApplicationCommandData) {
        BotClient.application?.commands.create(data);
        console.log(`Successfully created ${name} application command...`);
    }

    async delete(name: string) {
        const FetchedCommands = await BotClient.application?.commands.fetch();
        const Command = FetchedCommands?.find((x) => x.name === name);

        if (Command) BotClient.application?.commands.delete(Command.id);

        const message = Command
            ? `Successfully deleted ${name} application command...`
            : `The ${name} application command is most likely on kill mode...`;

        console.log(message);
    }

    async edit(name: string, data: ChatInputApplicationCommandData) {
        const FetchedCommands = await BotClient.application?.commands.fetch();
        const Command = FetchedCommands?.find((x) => x.name === name);

        const action = Command
            ? () => {
                  BotClient.application?.commands.delete(Command.id);
                  BotClient.application?.commands.create(data);
              }
            : () => {
                  BotClient.application?.commands.create(data);
              };

        console.log(`The application command ${name} has been edited...`);

        action();
    }
}

export class GuildCommand extends SlashCommand {
    async create(name: string, data: ChatInputApplicationCommandData) {
        if (!this.guild) return console.log(noGuild);

        for (const guild of this.guild) {
            const FetchedCommands = await guild.commands.fetch();
            const Command = FetchedCommands?.find((x) => x.name === name);

            if (!Command) {
                guild.commands.create(data);
                console.log(
                    `Successfully created ${name} guild application command...`
                );
            }
        }
    }

    async delete(name: string) {
        if (!this.guild) return console.log(noGuild);

        for (const guild of this.guild) {
            const FetchedCommands = await guild.commands.fetch();
            const Command = FetchedCommands?.find((x) => x.name === name);

            if (Command) guild.commands.delete(Command.id);

            const message = Command
                ? `Successfully deleted ${name} guild application command...`
                : `The ${name} guild application command is most likely on kill mode...`;

            console.log(message);
        }
    }

    async edit(name: string, data: ChatInputApplicationCommandData) {
        if (!this.guild) return console.log(noGuild);

        for (const guild of this.guild) {
            const FetchedCommands = await guild.commands.fetch();
            const Command = FetchedCommands?.find((x) => x.name === name);

            const action = Command
                ? () => {
                      guild?.commands.delete(Command.id);
                      guild?.commands.create(data);
                  }
                : () => {
                      guild?.commands.create(data);
                  };

            console.log(
                `The guild application command ${name} has been edited...`
            );

            action();
        }
    }
}

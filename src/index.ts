import { Client, GatewayIntentBits } from 'discord.js';
import { config as environmentConfig } from 'dotenv';

import { build } from './core/projectBuilder';

environmentConfig();
const proccessENV = process.env;

export const BotClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ],
});

console.log('New discord client created...');

export const GLOBALS = {
    BotToken: proccessENV.BOT_TOKEN,
};

//Running Project Builder
build();

BotClient.login(GLOBALS.BotToken);

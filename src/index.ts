import { Client, GatewayIntentBits } from 'discord.js';
import { config as environmentConfig } from 'dotenv';

import { build } from './core/projectBuilder';
// import delayData from './util/data/delays.json';
import { JsonData } from './util/functions/jsonData';

const JsonCtrl = new JsonData('/src/util/data/settings.json');

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
    Prefix: JsonCtrl.getOne('prefix'),
    ScEnabled: JsonCtrl.getOne('sc-enabled'),
    LcEnabled: JsonCtrl.getOne('lc-enabled'),
    DevId: JsonCtrl.getOne('dev-id'),
    ScGuilds: JsonCtrl.getOne('sc-guilds'),
};

//Running Project Builder
build();

BotClient.login(GLOBALS.BotToken);

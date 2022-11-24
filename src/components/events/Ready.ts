import { BotClient, JsonCtrl } from '../..';
import {
    globalLegacyDelays,
    userLegacyDelays,
} from '../../core/Handler/Rules/LegacyRules';
import {
    globalSlashDelays,
    userSlashDelays,
} from '../../core/Handler/Rules/SlashRules';
import { DiscordEvent } from '../../types/componentTypes';
import { JsonData } from '../../util/functions/jsonData';

export const E_Ready: DiscordEvent = {
    event: 'ready',
    // eslint-disable-next-line sonarjs/cognitive-complexity
    run: async () => {
        console.log(`${BotClient.user?.username} is now online`);

        if (JsonCtrl.getOne('legacy-delays-enabled') === true) {
            setInterval(() => {
                for (const index in userLegacyDelays) {
                    if (userLegacyDelays[index] - Date.now() <= 0) {
                        delete userLegacyDelays[index];
                    }
                }

                for (const index in globalLegacyDelays) {
                    if (globalLegacyDelays[index] - Date.now() <= 0) {
                        delete globalLegacyDelays[index];
                    }
                }

                const directoryPath = '/src/util/data/legacy-delays/';
                const L_userDelays = new JsonData(`${directoryPath}user.json`);
                const L_globlDelays = new JsonData(
                    `${directoryPath}global.json`
                );

                L_userDelays.writeBlank(userLegacyDelays);
                L_globlDelays.writeBlank(globalLegacyDelays);
            }, 5000);
        }

        if (JsonCtrl.getOne('slash-delays-enabled') === true) {
            setInterval(() => {
                for (const index in userSlashDelays) {
                    if (userSlashDelays[index] - Date.now() <= 0) {
                        delete userSlashDelays[index];
                    }
                }

                for (const index in globalSlashDelays) {
                    if (globalSlashDelays[index] - Date.now() <= 0) {
                        delete globalSlashDelays[index];
                    }
                }

                const directoryPath = '/src/util/data/slash-delays/';
                const S_userDelays = new JsonData(`${directoryPath}user.json`);
                const S_globlDelays = new JsonData(
                    `${directoryPath}global.json`
                );

                S_userDelays.writeBlank(userSlashDelays);
                S_globlDelays.writeBlank(globalSlashDelays);
            }, 5000);
        }
    },
};

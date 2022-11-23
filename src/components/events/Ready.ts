import { BotClient, JsonCtrl } from '../..';
import {
    globalLegacyDelays,
    userLegacyDelays,
} from '../../core/Handler/Rules/LegacyRules';
import { DiscordEvent } from '../../types/componentTypes';
import { JsonData } from '../../util/functions/jsonData';

export const E_Ready: DiscordEvent = {
    event: 'ready',
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
                L_globlDelays.writeBlank(userLegacyDelays);
            }, 5000);
        }
    },
};

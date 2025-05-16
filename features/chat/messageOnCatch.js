import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { getDoubleHookCatchMessage, getCatchMessage, isDoubleHook, isInFishingWorld } from '../../utils/common';
import { getWorldName, isInSkyblock } from '../../utils/playerState';
import { registerIf } from '../../utils/registers';

const chatCommand = 'pc';

triggers.RARE_CATCH_TRIGGERS.forEach(entry => {
    registerIf(
        register(
            "Chat",
            (event) => {
                const isDoubleHooked = isDoubleHook();
                sendMessageOnCatch({
                    seaCreature: entry.seaCreature,
                    rarityColorCode: entry.rarityColorCode,
                    isDoubleHook: isDoubleHooked,
                    isEnabled: settings[entry.isMessageEnabledSettingKey]
                });
            }
        ).setCriteria(entry.trigger).setContains(),
        () => settings[entry.isMessageEnabledSettingKey] && isInSkyblock() && isInFishingWorld(getWorldName())
    );
});

function sendMessageOnCatch(options) {
	try {
		if (!options.isEnabled || !isInSkyblock() || !isInFishingWorld(getWorldName())) {
			return;
		}
	
		const message = options.isDoubleHook ? getDoubleHookCatchMessage(options.seaCreature) : getCatchMessage(options.seaCreature);
		ChatLib.command(chatCommand + ' ' + message);	
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to send the message on catch.`);
	}
}
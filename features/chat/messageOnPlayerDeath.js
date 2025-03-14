import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { getPlayerDeathMessage } from '../../utils/common';
import { isInSkyblock } from '../../utils/playerState';

const chatCommand = 'pc';

triggers.KILLED_BY_TRIGGERS.forEach(entry => {
    register(
        "Chat",
        (event) => {
            sendMessageOnPlayerDeath({
                isEnabled: settings.messageOnDeath
            });
        }
    ).setCriteria(entry.trigger).setContains();
});

function sendMessageOnPlayerDeath(options) {
	try {
		if (!options.isEnabled || !isInSkyblock()) {
			return;
		}

		const message = getPlayerDeathMessage();
		ChatLib.command(chatCommand + ' ' + message);	
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to send the message on player's death.`);
	}
}
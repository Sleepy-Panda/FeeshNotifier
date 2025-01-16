import { getPlayerDeathMessage } from '../../utils/common';
import { isInSkyblock } from '../../utils/playerState';

const chatCommand = 'pc';

export function sendMessageOnPlayerDeath(options) {
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
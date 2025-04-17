import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { getPlayerDeathMessage } from '../../utils/common';
import { getWorldName, isInSkyblock } from '../../utils/playerState';
import { registerIf } from "../../utils/registers";
import { CRIMSON_ISLE } from "../../constants/areas";

const chatCommand = 'pc';

triggers.KILLED_BY_TRIGGERS.forEach(entry => {
	registerIf(
		register("Chat", (event) => sendMessageOnPlayerDeath()).setCriteria(entry.trigger).setContains(),
		() => settings.messageOnDeath && isInSkyblock() && getWorldName() === CRIMSON_ISLE
	);
});

function sendMessageOnPlayerDeath() {
	try {
		if (!settings.messageOnDeath || !isInSkyblock() || getWorldName() !== CRIMSON_ISLE) {
			return;
		}

		const message = getPlayerDeathMessage();
		ChatLib.command(chatCommand + ' ' + message);	
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to send the message on player's death.`);
	}
}
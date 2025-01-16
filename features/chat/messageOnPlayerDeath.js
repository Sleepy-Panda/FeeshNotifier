import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { getPlayerDeathMessage } from '../../utils/common';
import { getWorldName, isInSkyblock } from '../../utils/playerState';
import { registerWhen } from "../../utils/registers";
import { CRIMSON_ISLE } from "../../constants/areas";

const chatCommand = 'pc';

triggers.KILLED_BY_TRIGGERS.forEach(entry => {
	registerWhen(
		register("Chat", (event) => sendMessageOnPlayerDeath()).setCriteria(entry.trigger).setContains(),
		() => isInSkyblock() && settings.messageOnDeath && getWorldName() === CRIMSON_ISLE
	);
});

function sendMessageOnPlayerDeath() {
	try {
		const message = getPlayerDeathMessage();
		ChatLib.command(chatCommand + ' ' + message);	
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to send the message on player's death.`);
	}
}
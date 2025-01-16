import { getDoubleHookCatchMessage, getCatchMessage } from '../../utils/common';
import { isInSkyblock } from '../../utils/playerState';

const chatCommand = 'pc';

export function sendMessageOnCatch(options) {
	try {
		if (!options.isEnabled || !isInSkyblock()) {
			return;
		}
	
		const message = options.isDoubleHook ? getDoubleHookCatchMessage(options.seaCreature) : getCatchMessage(options.seaCreature);
		ChatLib.command(chatCommand + ' ' + message);	
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to send the message and play alert on catch.`);
	}
}
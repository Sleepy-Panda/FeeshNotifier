import settings from '../../settings';
import { getDropMessage } from '../../utils/common';
import { isInSkyblock } from '../../utils/playerState';

const chatCommand = 'pc';

export function sendMessageOnDrop(options) {
	try {
		if (!options.isEnabled || !isInSkyblock()) {
			return;
		}
		
		const message = settings.includeMagicFindIntoDropMessage
			? getDropMessage(options.itemName, options.magicFind)
			: getDropMessage(options.itemName);
		ChatLib.command(chatCommand + ' ' + message);
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to send the message and play alert on drop.`);
	}
}
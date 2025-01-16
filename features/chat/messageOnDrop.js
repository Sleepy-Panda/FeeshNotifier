import { getDropMessage, getDropTitle } from '../../utils/common';

const chatCommand = 'pc';

export function sendMessageOnDrop(options) {
	if (!options.isMessageEnabled && !options.isAlertEnabled) {
		return;
	}
	
	if (options.isMessageEnabled) {
		// Drop message has format: &r&6&lRARE DROP! &r&fEnchanted Book &r&b(+&r&b196% &r&b✯ Magic Find&r&b)&r&r
		const message = getDropMessage(options.itemName);
		ChatLib.command(chatCommand + ' ' + message);
	}
	
	// Play alert if you aren't in the party so automated message is not sent
	if (options.isAlertEnabled) {
		const title = getDropTitle(options.itemName);
		Client.showTitle(title, "", 1, 60, 1);
		options.sound.play();
	}
}
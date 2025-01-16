import settings from "../../settings";
import { getDropMessage, getDropTitle } from '../../utils/common';
import { MEME_SOUND_MODE, NORMAL_SOUND_MODE, NOTIFICATION_SOUND } from "../../constants/sounds";

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
		const title = getDropTitle(options.itemName, options.rarityColorCode);
		Client.showTitle(title, '', 1, 60, 1);

		switch (settings.soundMode) {
			case MEME_SOUND_MODE:
				options.sound.play();
				break;
			case NORMAL_SOUND_MODE:
				NOTIFICATION_SOUND.play();
				break;
			default:
				break;
		}
	}
}
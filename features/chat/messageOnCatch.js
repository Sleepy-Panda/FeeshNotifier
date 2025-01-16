import settings from "../../settings";
import { hasDoubleHookInMessage, getDoubleHookMessage, getMessage, getDoubleHookTitle, getTitle } from '../../utils/common';
import { NOTIFICATION_SOUND, OFF_SOUND_MODE } from '../../constants/sounds';

const chatCommand = 'pc';

export function sendMessageOnCatch(options) {
	if (!options.isMessageEnabled && !options.isAlertEnabled) {
		return;
	}

	const isDoubleHook = hasDoubleHookInMessage();

	if (options.isMessageEnabled) {
		const message = isDoubleHook ? getDoubleHookMessage(options.seaCreature) : getMessage(options.seaCreature);
		ChatLib.command(chatCommand + ' ' + message);
	}
	
	// Play alert if you aren't in the party so automated message is not sent
	if (options.isAlertEnabled) {
		const title = isDoubleHook ? getDoubleHookTitle(options.seaCreature, options.rarityColorCode) : getTitle(options.seaCreature, options.rarityColorCode);
		Client.showTitle(title, '', 1, 60, 1);
		
		if (settings.soundMode !== OFF_SOUND_MODE) {
			NOTIFICATION_SOUND.play();
		}
	}		
}
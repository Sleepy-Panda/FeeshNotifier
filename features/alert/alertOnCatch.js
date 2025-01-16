import settings from "../../settings";
import { getDoubleHookTitle, getTitle } from '../../utils/common';
import { NOTIFICATION_SOUND, OFF_SOUND_MODE } from '../../constants/sounds';

// Shows a title and plays a sound on automated rare catch message sent by this module.
export function playAlertOnCatch(options) {
	if (!options.isEnabled) {
		return;
	}
	
	const title = options.isDoubleHook ? getDoubleHookTitle(options.seaCreature, options.rarityColorCode) : getTitle(options.seaCreature, options.rarityColorCode);
	Client.showTitle(title, options.player || '', 1, 60, 1);

	if (settings.soundMode !== OFF_SOUND_MODE) {
		NOTIFICATION_SOUND.play();
	}
}

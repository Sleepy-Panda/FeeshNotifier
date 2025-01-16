import settings from "../../settings";
import { getDoubleHookTitle, getTitle } from '../../utils/common';
import { NOTIFICATION_SOUND, OFF_SOUND_MODE } from '../../constants/sounds';

export function playAlertOnCatch(options) {
	if (!options.isEnabled) {
		return;
	}
	
	const title = options.isDoubleHook ? getDoubleHookTitle(options.seaCreature) : getTitle(options.seaCreature);
	Client.showTitle(title, '', 1, 60, 1);

	if (settings.soundMode !== OFF_SOUND_MODE) {
		NOTIFICATION_SOUND.play();
	}
}

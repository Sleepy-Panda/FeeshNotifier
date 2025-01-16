import { getDoubleHookTitle, getTitle } from '../../utils/common';
import { NOTIFICATION_SOUND  } from '../../constants/sounds';

export function playAlertOnCatch(options) {
	if (!options.isEnabled) {
		return;
	}
	
	const title = options.isDoubleHook ? getDoubleHookTitle(options.seaCreature) : getTitle(options.seaCreature);
	Client.showTitle(title, "", 1, 60, 1);
	NOTIFICATION_SOUND.play();
}

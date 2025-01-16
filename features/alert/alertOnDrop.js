import settings from "../../settings";
import { getDropTitle } from '../../utils/common';
import { MEME_SOUND_MODE, NORMAL_SOUND_MODE, NOTIFICATION_SOUND } from "../../constants/sounds";

export function playAlertOnDrop(options) {
	if (!options.isEnabled) {
		return;
	}
		
	const title = getDropTitle(options.itemName);
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
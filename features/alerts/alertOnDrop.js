import settings from "../../settings";
import { getDropTitle } from '../../utils/common';
import { MEME_SOUND_MODE, NORMAL_SOUND_MODE, NOTIFICATION_SOUND_SOURCE } from "../../constants/sounds";
import { isInSkyblock } from "../../utils/playerState";

// Shows a title and plays a sound on automated rare drop message sent by this module.
export function playAlertOnDrop(options) {
	try {
		if (!options.isEnabled || !isInSkyblock()) {
			return;
		}
		
		// If the party message is sent by current player, no need to show alert because they were already alerted on initial drop.
		if (options.player && options.suppressIfSamePlayer && options.player.includes(Player.getName())) {
			return;
		}
	
		const title = getDropTitle(options.itemName, options.rarityColorCode);
		Client.showTitle(title, options.player || '', 1, 45, 1);
	
		switch (settings.soundMode) {
			case MEME_SOUND_MODE:
				new Sound(options.sound).play();
				break;
			case NORMAL_SOUND_MODE:
				new Sound(NOTIFICATION_SOUND_SOURCE).play();
				break;
			default:
				break;
		}	
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on drop.`);
	}
}
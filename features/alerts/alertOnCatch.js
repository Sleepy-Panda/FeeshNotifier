import settings from "../../settings";
import { getDoubleHookCatchTitle, getCatchTitle } from '../../utils/common';
import { NOTIFICATION_SOUND_SOURCE, OFF_SOUND_MODE } from '../../constants/sounds';
import { isInSkyblock } from "../../utils/playerState";

// Shows a title and plays a sound on automated rare catch message sent by this module.
export function playAlertOnCatch(options) {
	try {
		if (!options.isEnabled || !isInSkyblock()) {
			return;
		}

		// If the party message is sent by current player, no need to show alert because they were already alerted on initial catch.
		if (options.player && options.suppressIfSamePlayer && options.player.includes(Player.getName())) {
			return;
		}
		
		const title = options.isDoubleHook ? getDoubleHookCatchTitle(options.seaCreature, options.rarityColorCode) : getCatchTitle(options.seaCreature, options.rarityColorCode);
		Client.showTitle(title, options.player || '', 1, 45, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
			new Sound(NOTIFICATION_SOUND_SOURCE).play();
		}
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on catch.`);
	}
}

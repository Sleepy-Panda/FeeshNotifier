import settings from "../../settings";
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { RED } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";

// Shows a title and plays a sound on automated player death message sent by this module.
export function playAlertOnPlayerDeath(options) {
	try {
		if (!options.isEnabled || !isInSkyblock()) {
			return;
		}
		
		// If the party message is sent by current player, no need to show alert.
		if (options.player && options.player.includes(Player.getName())) {
			return;
		}
	
		const title = `${options.player || 'Party member'} ${RED}killed ☠`;
		Client.showTitle(title, 'Wait for them to come back', 1, 45, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
            World.playSound('mob.villager.death', 1, 1);
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on party member's death.`);
	}
}
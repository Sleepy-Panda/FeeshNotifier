import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { MC_RANDOM_ORB_SOUND, MEME_SOUND_MODE, NORMAL_SOUND_MODE, NOTIFICATION_SOUND } from "../../constants/sounds";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { getCatchTitle } from "../../utils/common";
import { registerIf } from "../../utils/registers";
import { JERRY_WORKSHOP } from "../../constants/areas";
import { userCatchSoundsData } from "../../data/userSounds";

// Alert on any reindrake spawned in a lobby

registerIf(
	register("Chat", (event) => playAlertOnReindrake()).setCriteria(triggers.REINDRAKE_SPAWNED_BY_ANYONE_MESSAGE).setContains(),
	() => settings.alertOnAnyReindrakeCatch && isInSkyblock() && getWorldName() === JERRY_WORKSHOP
);

const reindrakeTrigger = triggers.RARE_CATCH_TRIGGERS.find(t => t.seaCreature == seaCreatures.REINDRAKE);
const title = getCatchTitle(reindrakeTrigger.seaCreature, reindrakeTrigger.rarityColorCode);

function playAlertOnReindrake() {
	try {
		if (!settings.alertOnAnyReindrakeCatch || !isInSkyblock() || getWorldName() !== JERRY_WORKSHOP) {
			return;
		}
		
		Client.showTitle(title, '', 1, 30, 1);
	
		switch (settings.soundMode) {
			case MEME_SOUND_MODE:
			  const soundFileName = userCatchSoundsData[seaCreatures.REINDRAKE];
			  playSound(soundFileName, NOTIFICATION_SOUND);
			  break;
			case NORMAL_SOUND_MODE:
			  playMcSound(MC_RANDOM_ORB_SOUND);
			  break;
			default:
			  break;
		}
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on reindrake.`);
	}
}
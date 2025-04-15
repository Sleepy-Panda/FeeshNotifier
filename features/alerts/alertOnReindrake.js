import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { NOTIFICATION_SOUND_SOURCE, OFF_SOUND_MODE } from "../../constants/sounds";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { getCatchTitle } from "../../utils/common";
import { registerIf } from "../../utils/registers";
import { JERRY_WORKSHOP } from "../../constants/areas";

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
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
			new Sound(NOTIFICATION_SOUND_SOURCE).play();
		}
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on reindrake.`);
	}
}
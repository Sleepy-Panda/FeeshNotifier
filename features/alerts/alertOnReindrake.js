import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { NOTIFICATION_SOUND_SOURCE, OFF_SOUND_MODE } from "../../constants/sounds";
import { isInSkyblock } from "../../utils/playerState";
import { getCatchTitle } from "../../utils/common";

// Alert on any reindrake spawned in a lobby

register("Chat", (event) => playAlertOnReindrake()).setCriteria(triggers.REINDRAKE_SPAWNED_BY_ANYONE_MESSAGE).setContains();

const reindrakeTrigger = triggers.RARE_CATCH_TRIGGERS.find(t => t.seaCreature == seaCreatures.REINDRAKE);
const title = getCatchTitle(reindrakeTrigger.seaCreature, reindrakeTrigger.rarityColorCode);

function playAlertOnReindrake() {
	try {
		if (!settings.alertOnAnyReindrakeCatch || !isInSkyblock()) {
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
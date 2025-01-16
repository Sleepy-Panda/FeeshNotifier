import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { AQUA } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";

register("Chat", (event) => playAlertOnThunderBottleCharged()).setCriteria(triggers.THUNDER_BOTTLE_CHARGED_MESSAGE).setContains();

function playAlertOnThunderBottleCharged() {
	try {
		if (!settings.alertOnThunderBottleCharged || !isInSkyblock()) {
			return;
		}
		
		Client.showTitle(`${AQUA}Thunder bottle is full`, '', 1, 30, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
            World.playSound('random.orb', 1, 1);
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on thunder bottle charged.`);
	}
}
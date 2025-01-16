import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { GOLD, WHITE } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";

register("Chat", (event) => playAlertOnGoldenFish()).setCriteria(triggers.GOLDEN_FISH_MESSAGE);

function playAlertOnGoldenFish() {
	try {
		if (!settings.alertOnGoldenFishSpawned || !isInSkyblock()) {
			return;
		}
		
		Client.showTitle(`${WHITE}Catch ${GOLD}Golden Fish`, '', 1, 30, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
            World.playSound('random.splash', 1, 1);
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on Golden Fish.`);
	}
}
import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { MC_RANDOM_SPLASH_SOUND, OFF_SOUND_MODE } from "../../constants/sounds";
import { GOLD, WHITE } from "../../constants/formatting";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { CRIMSON_ISLE } from "../../constants/areas";
import { playMcSound } from "../../utils/sound";

registerIf(
	register("Chat", (event) => playAlertOnGoldenFish()).setCriteria(triggers.GOLDEN_FISH_MESSAGE),
	() => settings.alertOnGoldenFishSpawned && isInSkyblock() && getWorldName() === CRIMSON_ISLE
);

function playAlertOnGoldenFish() {
	try {
		if (!settings.alertOnGoldenFishSpawned || !isInSkyblock() || getWorldName() !== CRIMSON_ISLE) {
			return;
		}
		
		Client.showTitle(`${WHITE}Catch ${GOLD}Golden Fish`, '', 1, 30, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
            playMcSound(MC_RANDOM_SPLASH_SOUND);
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on Golden Fish.`);
	}
}
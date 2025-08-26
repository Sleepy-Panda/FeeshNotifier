import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { BLUE, RESET } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { playMcSound } from "../../utils/sound";

registerIf(
	register("Chat", (petDisplayName, level, event) => playAlertOnPetLevelUp(+level, petDisplayName))
        .setCriteria(triggers.PET_LEVEL_UP_MESSAGE)
        .setContains(),
	() => settings.alertOnPetLevelUp && isInSkyblock()
);

function playAlertOnPetLevelUp(level, petDisplayName) {
	try {
		if (!settings.alertOnPetLevelUp || !isInSkyblock()) {
			return;
		}

        if (level !== 100 && level !== 200) {
            return;
        }
		
		Client.showTitle(`${petDisplayName} ${RESET}is maxed`, `Level ${BLUE}${level}`, 1, 30, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
            playMcSound('random.orb');
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on pet level up.`);
	}
}
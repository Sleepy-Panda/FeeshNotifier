import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { MC_RANDOM_ORB_SOUND, OFF_SOUND_MODE } from "../../constants/sounds";
import { DARK_PURPLE, GOLD, GREEN, WHITE, YELLOW } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { playMcSound } from "../../utils/sound";

registerIf(
	register("Chat", (event) => playAlertOnSpiritMaskUsed()).setCriteria(triggers.SPIRIT_MASK_USED_MESSAGE),
	() => settings.alertOnSpiritMaskUsed && isInSkyblock()
);

function playAlertOnSpiritMaskUsed() {
	try {
		if (!settings.alertOnSpiritMaskUsed || !isInSkyblock()) {
			return;
		}
		
		Client.showTitle(`${YELLOW}Spirit Mask used`, '', 1, 30, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
            playMcSound(MC_RANDOM_ORB_SOUND);
        }

		if (settings.alertOnSpiritMaskBack) {
			setTimeout(playAlertOnSpiritMaskBack, 30000);
		}
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on Spirit Mask used.`);
	}
}

function playAlertOnSpiritMaskBack() {
	try {
		ChatLib.chat(`${GOLD}[FeeshNotifier] ${DARK_PURPLE}Spirit Mask ${WHITE}is ready!`);
		Client.showTitle(`${GREEN}Spirit Mask ready`, '', 1, 30, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
            playMcSound(MC_RANDOM_ORB_SOUND);
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on Spirit Mask ready.`);
	}
}

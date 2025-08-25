import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { DARK_PURPLE, GOLD, GREEN, WHITE, YELLOW } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";

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
            new Sound({ source: 'random.orb', volume: 1, pitch: 1 }).play();
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
            new Sound({ source: 'random.orb', volume: 1, pitch: 1 }).play();
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on Spirit Mask ready.`);
	}
}

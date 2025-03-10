import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { GOLD, WHITE, YELLOW } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";

register(
	"Chat",
	(event) => playAlertOnSpiritMaskUsed()
).setCriteria(triggers.SPIRIT_MASK_USED_MESSAGE);

function playAlertOnSpiritMaskUsed() {
	try {
		if (!settings.alertOnSpiritMaskUsed || !isInSkyblock()) {
			return;
		}
		
		Client.showTitle(`${YELLOW}Spirit Mask used`, '', 1, 30, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
            World.playSound('random.orb', 1, 1);
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
		ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Spirit Mask is ready!`);
		Client.showTitle(`${YELLOW}Spirit Mask ready`, '', 1, 30, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
            World.playSound('random.orb', 1, 1);
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on Spirit Mask ready.`);
	}
}

import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { AQUA } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";

triggers.BOTTLE_CHARGED_TRIGGERS.forEach(entry => {
	registerIf(
		register(
			"Chat",
			(event) => setTimeout(() => playAlertOnBottleCharged(entry.bottleName), 1000) // Delay because the alert is often overriden by the Thunder spawn alert
		).setCriteria(entry.trigger).setContains(),
		() => settings.alertOnThunderBottleCharged && isInSkyblock()
	);
});

function playAlertOnBottleCharged(bottleName) {
	try {
		if (!settings.alertOnThunderBottleCharged || !isInSkyblock()) {
			return;
		}
		
		Client.showTitle(`${AQUA}${bottleName} is full`, '', 1, 30, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
            new Sound({ source: 'random.orb', volume: 1, pitch: 1 }).play();
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on thunder bottle charged.`);
	}
}
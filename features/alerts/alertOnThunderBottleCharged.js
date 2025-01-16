import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { AQUA } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";
import { registerWhen } from "../../utils/registers";

triggers.BOTTLE_CHARGED_TRIGGERS.forEach(entry => {
	registerWhen(
		register(
			"Chat",
			(event) => setTimeout(() => playAlertOnBottleCharged(entry.bottleName), 1000) // Delay because the alert is often overriden by the Thunder spawn alert
		).setCriteria(entry.trigger).setContains(),
		() => isInSkyblock() && settings.alertOnThunderBottleCharged
	);
});

function playAlertOnBottleCharged(bottleName) {
	try {
		Client.showTitle(`${AQUA}${bottleName} is full`, '', 1, 30, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
            World.playSound('random.orb', 1, 1);
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on thunder bottle charged.`);
	}
}
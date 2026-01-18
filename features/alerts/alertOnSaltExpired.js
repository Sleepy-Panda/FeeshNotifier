import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { OFF_SOUND_MODE, TIMER_SOUND_SOURCE } from "../../constants/sounds";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { RED } from "../../constants/formatting";

registerIf(
	register("Chat", (saltName, event) => playAlertOnSaltExpired(saltName)).setCriteria(triggers.SALT_EXPIRED_MESSAGE).setContains(),
	() => settings.alertOnSaltExpired && isInSkyblock()
);

function playAlertOnSaltExpired(saltName) {
	try {
		if (!settings.alertOnSaltExpired || !isInSkyblock() || !saltName) return;
		
		Client.showTitle(`${RED}${saltName.removeFormatting()} ${RED}has expired`, '', 1, 30, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE)
		{
			new Sound(TIMER_SOUND_SOURCE).play();
		}
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on Salt expired.`);
	}
}


import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { YELLOW } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";

let worldChangedAt = null;

register("Chat", (event) => setTimeout(playAlertOnBucketAutoPickup, 500)).setCriteria(triggers.CHUM_BUCKET_AUTO_PICKED_UP_MESSAGE);

register("worldUnload", () => {
    worldChangedAt = new Date();
});

export function playAlertOnBucketAutoPickup() {
	try {
		if (!settings.alertOnChumBucketAutoPickedUp || !isInSkyblock() || !World.isLoaded) {
			return;
		}

		if (worldChangedAt && new Date() - worldChangedAt < 2000) {
			return;
		}

		Client.showTitle(`${YELLOW}Chum Bucket is gone`, '', 1, 30, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
            World.playSound('random.orb', 1, 1);
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on Chum bucket auto pickup.`);
	}
}
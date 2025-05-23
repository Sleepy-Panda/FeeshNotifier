import settings from "../../settings";
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { HOTSPOT_WORLDS } from "../../constants/areas";
import { GOLD, LIGHT_PURPLE, RED, RESET, WHITE } from "../../constants/formatting";
import { getPlayerFishingHook, isFishingHookActive } from "../../utils/common";
import { findClosestHotspotInRange, findHotspotsInRange } from "../../utils/entityDetection";
import { registerIf } from "../../utils/registers";

let lastClosestHotspot = null;

registerIf(
    register("step", (event) => playAlertOnHotspotGone()).setDelay(1),
    () => settings.alertOnHotspotGone && isInSkyblock() && HOTSPOT_WORLDS.includes(getWorldName())
);

register("worldUnload", () => {
    lastClosestHotspot = null;
});

function playAlertOnHotspotGone() {
	try {
		if (!settings.alertOnHotspotGone ||
            !HOTSPOT_WORLDS.includes(getWorldName()) ||
            !hasFishingRodInHotbar() ||
            !isInSkyblock()
        ) {
			return;
		}
		
        const nearbyHotspots = findHotspotsInRange(Player.getPlayer(), 20);

        if (lastClosestHotspot && lastClosestHotspot.entity.distanceTo(Player.getPlayer()) > 20) { // Player moved away
            lastClosestHotspot = null;
        }
        
        if (lastClosestHotspot &&
            lastClosestHotspot.entity.distanceTo(Player.getPlayer()) <= 20 && 
            !nearbyHotspots.find(ch =>
                ch.entity.getX() === lastClosestHotspot.entity.getX() &&
                ch.entity.getY() === lastClosestHotspot.entity.getY() &&
                ch.entity.getZ() === lastClosestHotspot.entity.getZ()
            )
        ) {
            playAlert(lastClosestHotspot.perk);
            lastClosestHotspot = null;
        }

        const isHookActive = isFishingHookActive();
        if (isHookActive) {
            const playerHook = getPlayerFishingHook();
            const closestHotspot = findClosestHotspotInRange(playerHook, 7);

            if (closestHotspot) {
                lastClosestHotspot = closestHotspot;
            }
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on Hotspot gone.`);
	}
}

function playAlert(perk) {
    if (!perk) return;

    Client.showTitle(`${LIGHT_PURPLE}Hotspot ${RED}is gone`, '', 1, 30, 1);
    ChatLib.chat(`${GOLD}[FeeshNotifier] ${perk} ${RESET}${LIGHT_PURPLE}Hotspot ${WHITE}is gone, time to find another one!`);
        
    if (settings.soundMode !== OFF_SOUND_MODE) {
        World.playSound('random.orb', 1, 1);
    }
}
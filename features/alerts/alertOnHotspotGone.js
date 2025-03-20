import settings from "../../settings";
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { HOTSPOT_WORLDS } from "../../constants/areas";
import { GOLD, LIGHT_PURPLE, RESET, WHITE, YELLOW } from "../../constants/formatting";
import { EntityArmorStand, EntityFishHook } from "../../constants/javaTypes";
import { isFishingHookActive } from "../../utils/common";

let lastClosestHotspot = null;
let lastClosestHotspotPerk = null;

register("step", (event) => playAlertOnHotspotGone()).setDelay(1);
register("worldUnload", () => {
    lastClosestHotspot = null;
    lastClosestHotspotPerk = null;
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
		
        let currentHotspots = [];

        const armorStands = World.getAllEntitiesOfType(EntityArmorStand).filter(entity => entity.distanceTo(Player.getPlayer()) <= 30);
        armorStands.forEach(entity => {
            const plainName = entity?.getName()?.removeFormatting();
            if (plainName === 'HOTSPOT') {
                currentHotspots.push({
                    entity: entity,
                    perk: armorStands.find(e => e.getX() === entity.getX() && e.getY() < entity.getY()&& entity.getY() - e.getY() < 2 && e.getZ() === entity.getZ() && e.getPitch() === entity.getPitch())?.getName()
                });
            }
        });

        if (lastClosestHotspot && lastClosestHotspot.distanceTo(Player.getPlayer()) > 30) { // Player moved away
            lastClosestHotspot = null;
            lastClosestHotspotPerk = null;
        } else if (lastClosestHotspot && lastClosestHotspot.distanceTo(Player.getPlayer()) <= 30 && 
            !currentHotspots.find(ch => ch.entity.getX() === lastClosestHotspot.getX() && ch.entity.getY() === lastClosestHotspot.getY() && ch.entity.getZ() === lastClosestHotspot.getZ())
        ) {
            playAlert();
            lastClosestHotspot = null;
            lastClosestHotspotPerk = null;
        }

        const isHookActive = isFishingHookActive();
        if (isHookActive) {
            const playerHook = World.getAllEntitiesOfType(EntityFishHook).find(e => Player.getPlayer().field_71104_cf == e.getEntity()); // field_71104_cf = fishEntity

            const closestHotspot = currentHotspots
                .filter(h => h.entity.distanceTo(playerHook) <= 5)
                .sort((a, b) => a.entity.distanceTo(playerHook) < b.entity.distanceTo(playerHook))
                .find(() => true);

            lastClosestHotspot = closestHotspot?.entity;
            lastClosestHotspotPerk = closestHotspot?.perk || null;
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on Hotspot gone.`);
	}
}

function playAlert() {
    Client.showTitle(`${YELLOW}Hotspot is gone`, '', 1, 30, 1);
    ChatLib.chat(`${GOLD}[FeeshNotifier] ${LIGHT_PURPLE}Hotspot ${lastClosestHotspotPerk} ${RESET}${WHITE}is gone, time to find another one!`);
        
    if (settings.soundMode !== OFF_SOUND_MODE) {
        World.playSound('random.orb', 1, 1);
    }
}
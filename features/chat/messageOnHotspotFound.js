import settings from "../../settings";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { HOTSPOT_WORLDS } from "../../constants/areas";
import { BLUE, BOLD, GOLD, LIGHT_PURPLE, RESET, WHITE } from "../../constants/formatting";
import { EntityArmorStand } from "../../constants/javaTypes";
import { getMessageId, getZoneName } from "../../utils/common";

let lastClosestHotspot = null;

register("step", (event) => sendMessageOnHotspotFound()).setDelay(1);
register("worldUnload", () => {
    lastClosestHotspot = null;
});

function findClosestHotspotTo(entity, radius) {
    if (!entity || !radius) return;

    const armorStands = World.getAllEntitiesOfType(EntityArmorStand).filter(as => as.distanceTo(entity) <= radius);
    const closestHotspotArmorStand = armorStands
        .filter(as => as?.getName()?.removeFormatting() === 'HOTSPOT')
        .sort((a, b) => a.distanceTo(entity) < b.distanceTo(entity))
        .find(() => true); // Find first or null

    const closestHotspot = closestHotspotArmorStand
        ? {
            position: closestHotspotArmorStand.getPos(),
            perk: armorStands.find(e =>
                e.getX() === closestHotspotArmorStand.getX() &&
                e.getY() < closestHotspotArmorStand.getY() &&
                closestHotspotArmorStand.getY() - e.getY() < 2 &&
                e.getZ() === closestHotspotArmorStand.getZ() &&
                e.getPitch() === closestHotspotArmorStand.getPitch())?.getName()
        }
        : null;

    return closestHotspot;
}

function sendMessageOnHotspotFound() {
	try {
		if (!settings.messageOnHotspotFound ||
            !HOTSPOT_WORLDS.includes(getWorldName()) ||
            !isInSkyblock()
        ) {
			return;
		}
		
        const closestHotspot = findClosestHotspotTo(Player.getPlayer(), 6);

        if ((!lastClosestHotspot && closestHotspot) ||
            (lastClosestHotspot && closestHotspot &&
                closestHotspot.position.x !== lastClosestHotspot.position.x &&
                closestHotspot.position.y !== lastClosestHotspot.position.y &&
                closestHotspot.position.z !== lastClosestHotspot.position.z
            )
        ) {
            sendChatMessage(closestHotspot.position, closestHotspot.perk);
        }

        if (closestHotspot) { // Do not share the same hotspot
            lastClosestHotspot = closestHotspot;
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to send message on Hotspot found.`);
	}
}

function sendChatMessage(position, perk) {
    if (!position || !perk) return;

    const message = getMessage(position, perk);
    new Message(
        `${GOLD}[FeeshNotifier] ${WHITE}You found ${perk} ${RESET}${LIGHT_PURPLE}Hotspot${WHITE}.\n`,
        new TextComponent(`${BLUE}${BOLD}[Click to share to PARTY chat]\n`)
            .setClickAction('run_command')
            .setClickValue('/pc ' + message),
        new TextComponent(`${WHITE}${BOLD}[Click to share to ALL chat]`)
            .setClickAction('run_command')
            .setClickValue('/ac ' + message),
    ).chat();
}

function getMessage(position, perk) {
    const location = `x: ${Math.round(position.x)}, y: ${Math.round(position.y)}, z: ${Math.round(position.z)}`;
    const zone = getZoneName();
    const messageId = getMessageId();

    let message = '';
    message += `${location} | ${perk ? perk.removeFormatting() + ' ' : ''}Hotspot ${zone ? ' at ' + zone.getName().removeFormatting() : ''} | ${messageId}`;
    return message;
}
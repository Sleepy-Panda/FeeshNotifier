import settings from "../../settings";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { HOTSPOT_WORLDS } from "../../constants/areas";
import { BLUE, BOLD, GOLD, GRAY, LIGHT_PURPLE, RESET, WHITE, YELLOW } from "../../constants/formatting";
import { getMessageId, getZoneName } from "../../utils/common";
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { findClosestHotspotInRange } from "../../utils/entityDetection";

let lastClosestHotspot = null;
let lastFoundHotspotIds = []; // Remember 2 last found hotspots, to avoid announcing the same hotspots placed close to each other, when user is moving between them

register("step", (event) => sendMessageOnHotspotFound()).setDelay(1);
register("worldUnload", () => {
    lastClosestHotspot = null;
    lastFoundHotspotIds = [];
});

function sendMessageOnHotspotFound() {
	try {
		if (!settings.messageOnHotspotFound ||
            !HOTSPOT_WORLDS.includes(getWorldName()) ||
            !isInSkyblock()
        ) {
			return;
		}
		
        const closestHotspot = findClosestHotspotInRange(Player.getPlayer(), 6);
        const closestHotspotId = closestHotspot ? closestHotspot.entity.getUUID() : null;

        if (closestHotspot && !lastFoundHotspotIds.includes(closestHotspotId) && (
            !lastClosestHotspot ||
            (lastClosestHotspot && closestHotspot && !(
                closestHotspot.position.x === lastClosestHotspot.position.x &&
                closestHotspot.position.y === lastClosestHotspot.position.y &&
                closestHotspot.position.z === lastClosestHotspot.position.z)
            ))      
        ) {
            sendChatMessage(closestHotspot.position, closestHotspot.perk);

            lastFoundHotspotIds.unshift(closestHotspotId);
            lastFoundHotspotIds.length = Math.min(lastFoundHotspotIds.length, 2);
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
    if (!position || !perk) {
        return;
    }

    const message = getMessage(position, perk);
    new Message(
        `${GOLD}[FeeshNotifier] ${WHITE}You found ${perk} ${RESET}${LIGHT_PURPLE}Hotspot${WHITE}.\n`,
        new TextComponent(`${WHITE}${BOLD}[Share to ${BLUE}${BOLD}PARTY ${WHITE}${BOLD}chat]`)
            .setClickAction('run_command')
            .setClickValue('/pc ' + message),
        ` ${GRAY}or `,
        new TextComponent(`${WHITE}${BOLD}[Share to ${YELLOW}${BOLD}ALL ${WHITE}${BOLD}chat]`)
            .setClickAction('run_command')
            .setClickValue('/ac ' + message),
    ).chat();

    if (settings.soundMode !== OFF_SOUND_MODE) {
        World.playSound('random.orb', 1, 1);
    }
}

function getMessage(position, perk) {
    const location = `x: ${Math.round(position.x)}, y: ${Math.round(position.y)}, z: ${Math.round(position.z)}`;
    const zone = getZoneName();
    const messageId = getMessageId();

    let message = '';
    message += `${location} | ${perk ? perk.removeFormatting() + ' ' : ''}Hotspot${zone ? ' at ' + zone.getName().removeFormatting() : ''} | ${messageId}`;
    return message;
}
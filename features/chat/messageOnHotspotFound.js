import settings from "../../settings";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { HOTSPOT_WORLDS } from "../../constants/areas";
import { BLUE, BOLD, GOLD, GRAY, LIGHT_PURPLE, RESET, WHITE, YELLOW } from "../../constants/formatting";
import { getMessageId, getZoneName } from "../../utils/common";
import { MC_RANDOM_ORB_SOUND, OFF_SOUND_MODE } from "../../constants/sounds";
import { findClosestHotspotInRange } from "../../utils/entityDetection";
import { registerIf } from "../../utils/registers";
import { playMcSound } from "../../utils/sound";

let lastClosestHotspot = null;
let lastFoundHotspotIds = []; // Remember 2 last found hotspots, to avoid announcing the same hotspots placed close to each other, when user is moving between them

const HOTSPOT_RANGE = 7;

registerIf(
    register("step", (event) => sendMessageOnHotspotFound()).setDelay(1),
    () => (settings.messageOnHotspotFound || settings.autoMessageOnHotspotFound) && isInSkyblock() && HOTSPOT_WORLDS.includes(getWorldName())
);

register("worldUnload", () => {
    lastClosestHotspot = null;
    lastFoundHotspotIds = [];
});

export function sendMessageWithNearestHotspot(chatCommand) {
	try {
		if (!HOTSPOT_WORLDS.includes(getWorldName()) || !isInSkyblock()) {
			return;
		}
		
        const closestHotspot = findClosestHotspotInRange(Player.getPlayer(), HOTSPOT_RANGE);
        if (closestHotspot) {
            announceNearestHotspot(closestHotspot.position, closestHotspot.perk, chatCommand);
        } else {
            ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}No Hotspot found nearby, move closer to be in ${HOTSPOT_RANGE} blocks range!`);
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to share nearby Hotspot.`);
	}

    function announceNearestHotspot(position, perk, chatCommand) {
        if (!position || !perk || !chatCommand) return;
    
        const message = getMessage(position, perk);
        ChatLib.command(chatCommand + ' ' + message);
    }
}

function sendMessageOnHotspotFound() {
	try {
		if ((!settings.messageOnHotspotFound && !settings.autoMessageOnHotspotFound) ||
            !HOTSPOT_WORLDS.includes(getWorldName()) ||
            !isInSkyblock()
        ) {
			return;
		}
		
        const closestHotspot = findClosestHotspotInRange(Player.getPlayer(), HOTSPOT_RANGE);
        const closestHotspotId = closestHotspot ? closestHotspot.entity.getUUID() : null;

        if (closestHotspot && !lastFoundHotspotIds.includes(closestHotspotId) && (
            !lastClosestHotspot ||
            (lastClosestHotspot && closestHotspot && !(
                closestHotspot.position.x === lastClosestHotspot.position.x &&
                closestHotspot.position.y === lastClosestHotspot.position.y &&
                closestHotspot.position.z === lastClosestHotspot.position.z)
            ))      
        ) {
            announceFoundHotspot(closestHotspot.position, closestHotspot.perk);

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

function announceFoundHotspot(position, perk) {
    if (!position || !perk) return;

    const message = getMessage(position, perk);

    if (settings.messageOnHotspotFound) {
        new TextComponent(
            `${GOLD}[FeeshNotifier] ${WHITE}You found ${perk} ${RESET}${LIGHT_PURPLE}Hotspot${WHITE}.\n`,
            new TextComponent({
                text: `${WHITE}${BOLD}[Share to ${BLUE}${BOLD}PARTY ${WHITE}${BOLD}chat]`,
                clickEvent: { action: 'run_command', value: '/pc ' + message },
            }),
            ` ${GRAY}or `,
            new TextComponent({
                text: `${WHITE}${BOLD}[Share to ${YELLOW}${BOLD}ALL ${WHITE}${BOLD}chat]`,
                clickEvent: { action: 'run_command', value: '/ac ' + message },
            })
        ).chat();
    
        if (settings.soundMode !== OFF_SOUND_MODE) {
            playMcSound(MC_RANDOM_ORB_SOUND);
        }
    }

    if (settings.autoMessageOnHotspotFound) {
        const command = settings.autoMessageOnHotspotFoundSource === 0 ? 'pc' : 'ac';
        ChatLib.command(command + ' ' + message);
    }
}

function getMessage(position, perk) {
    const location = `x: ${Math.round(position.x)}, y: ${Math.round(position.y)}, z: ${Math.round(position.z)}`;
    const zone = getZoneName();
    const messageId = getMessageId();

    const message = `${location} | ${perk ? perk.removeFormatting() + ' ' : ''}Hotspot${zone ? ' at ' + zone.removeFormatting() : ''} | ${messageId}`;
    return message;
}
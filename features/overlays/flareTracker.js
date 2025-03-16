import settings, { allOverlaysGui } from "../../settings";
import { GOLD, RED, RESET, WHITE, YELLOW } from "../../constants/formatting";
import { EntityFireworkRocket } from "../../constants/javaTypes";
import { OFF_SOUND_MODE, TIMER_SOUND_SOURCE } from "../../constants/sounds";
import { overlayCoordsData } from "../../data/overlayCoords";
import { isInSkyblock } from "../../utils/playerState";

let isFlarePlaced = false;
let flareName = null;
let lastFlarePlacedAt = null;
let flareTimerRemainingSeconds = null;
let flareX = null;
let flareZ = null;

const secondsBeforeExpiration = 10;
const flareDistance = 40;

// We check for interaction with a flare, to minimize triggering on other people flares & other types of firework rockets e.g. Bat Fireworks.
register("playerInteract", (action, pos, event) => handleFlareInteraction(action));
register('step', () => trackFlareStatus()).setFps(1);
register('renderOverlay', () => renderFlareOverlay());
register("worldUnload", () => {
    resetFlare();
});
register("chat", () => {
    resetFlare();
}).setCriteria(`${RESET}${YELLOW}Your flare disappeared because you were too far away!${RESET}`);

function handleFlareInteraction(action) {
    try {
        if ((!settings.alertOnFlareExpiresSoon && !settings.flareRemainingTimeOverlay) ||
            !isInSkyblock ||
            !action.toString().includes('RIGHT_CLICK') ||
            new Date() - lastFlarePlacedAt < 500 // sometimes playerInteract event happens multiple times
        ) {
            return;
        }

        const heldItemName = Player.getHeldItem()?.getName();
        const isFlare = heldItemName?.includes('Flare');
        if (!isFlare) {
            return;
        }

        setTimeout(function() {
            trackFlareNearby(heldItemName);
        }, 500); // Give time for a firework rocket to appear after click
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to handle flare interaction.`);
	}

    function trackFlareNearby(heldItemName) {
        const player = Player.getPlayer();
        const flareRockets = World
            .getAllEntitiesOfType(EntityFireworkRocket)
            .filter(rocket => rocket.distanceTo(player) <= flareDistance);
    
        if (flareRockets.length) {
            var closestFlareRocket = flareRockets.reduce(function(prev, curr) {
                return prev.distanceTo(player) < curr.distanceTo(player) ? prev : curr;
            });
            isFlarePlaced = true;
            flareTimerRemainingSeconds = 180;
            flareName = heldItemName;
            lastFlarePlacedAt = new Date();
            flareX = closestFlareRocket.getX();
            flareZ = closestFlareRocket.getZ();
        }
    
        // Future notes: flare itself appears on slightly different coords than the initial rocket
        // e.g. rocket is at 62.01113596669814 -160.09375 and flare (armor stand) is at 62.125 -160.09375
    }    
}

function trackFlareStatus() {
    try {
        if ((!settings.alertOnFlareExpiresSoon && !settings.flareRemainingTimeOverlay) || !isInSkyblock) {
            return;
        }

        if (isFlarePlaced && flareTimerRemainingSeconds <= 0) {
            resetFlare();
        }
    
        if (isFlarePlaced) {
            flareTimerRemainingSeconds -= 1;
    
            if (settings.alertOnFlareExpiresSoon && flareTimerRemainingSeconds === secondsBeforeExpiration) {
                Client.showTitle(`${flareName} ${RED}expires soon`, '', 1, 30, 1);
                ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Your ${flareName} ${WHITE}expires soon.`);
    
                if (settings.soundMode !== OFF_SOUND_MODE)
                {
                    new Sound(TIMER_SOUND_SOURCE).play();
                }
            }
        }    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track flare status.`);
	}
}

function resetFlare() {
    if (!isFlarePlaced) {
        return;
    }

    isFlarePlaced = false;
    flareName = null;
    lastFlarePlacedAt = null;
    flareTimerRemainingSeconds = null;
    flareX = null;
    flareZ = null;
}

function renderFlareOverlay() {
    if (!settings.flareRemainingTimeOverlay ||
        !isFlarePlaced ||
        flareTimerRemainingSeconds <= 0 ||
        !isInSkyblock() ||
        allOverlaysGui.isOpen()
    ) {
        return;
    }

    const timerColor = flareTimerRemainingSeconds <= secondsBeforeExpiration ? RED : WHITE;
    const minutes = ~~((flareTimerRemainingSeconds % 3600) / 60);
    const seconds = ~~flareTimerRemainingSeconds % 60;
    const text = minutes > 0 ? `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s` : `${seconds.toString().padStart(2, '0')}s`;
    const overlayText = `${flareName}: ${timerColor}${text}`;
    const overlay = new Text(`${overlayText}`, overlayCoordsData.flareRemainingTimeOverlay.x, overlayCoordsData.flareRemainingTimeOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.flareRemainingTimeOverlay.scale);
    overlay.draw();
}

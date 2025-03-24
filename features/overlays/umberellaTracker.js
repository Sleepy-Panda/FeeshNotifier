import settings, { allOverlaysGui } from "../../settings";
import { BLUE, GOLD, RED, RESET, WHITE } from "../../constants/formatting";
import { EntityArmorStand } from "../../constants/javaTypes";
import { OFF_SOUND_MODE, TIMER_SOUND_SOURCE } from "../../constants/sounds";
import { overlayCoordsData } from "../../data/overlayCoords";
import { isInSkyblock } from "../../utils/playerState";

let isUmberellaPlaced = false;
let lastUmberellaPlacedAt = null;
let umberellaTimerRemainingSeconds = null;
let umberellaX = null;
let umberellaZ = null;

const secondsBeforeExpiration = 10;
const umberellaDistance = 30;

// We check for interaction with an Umberella, to minimize triggering on other people Umberellas.
register("playerInteract", (action, pos, event) => handleUmberellaInteraction(action));
register('step', () => trackUmberellaStatus()).setFps(1);
register('renderOverlay', () => renderUmberellaOverlay());
register("worldUnload", () => {
    resetUmberella();
});

function handleUmberellaInteraction(action) {
    try {
        if ((!settings.alertOnFlareExpiresSoon && !settings.flareRemainingTimeOverlay) || // TODO
            !isInSkyblock ||
            !action.toString().includes('RIGHT_CLICK') ||
            new Date() - lastUmberellaPlacedAt < 500 // sometimes playerInteract event happens multiple times
        ) {
            return;
        }

        const heldItemName = Player.getHeldItem()?.getName();
        const isUmberella = heldItemName?.includes('Umberella');
        if (!isUmberella) {
            return;
        }

        setTimeout(function() {
            trackUmberellaNearby(heldItemName);
        }, 500);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to handle umberella interaction.`);
	}

    function trackUmberellaNearby() {
        const player = Player.getPlayer();
        const umberellas = World
            .getAllEntitiesOfType(EntityArmorStand)
            .filter(as => as.distanceTo(player) <= 5 && as.getName()?.removeFormatting()?.startsWith('Umberella 300s'));
    
        if (umberellas.length) {
            isUmberellaPlaced = true;
            lastUmberellaPlacedAt = new Date();
            umberellaTimerRemainingSeconds = 300; // TODO 600 with bubblegum
            umberellaX = umberellas[0].getX();
            umberellaZ = umberellas[0].getZ();
            ChatLib.chat('Initial ' + umberellaX + ' ' + umberellaZ);
        }
    }    
}

function trackUmberellaStatus() {
    try {
        if ((!settings.alertOnFlareExpiresSoon && !settings.flareRemainingTimeOverlay) || !isInSkyblock) { // TODO
            return;
        }
    
        if (isUmberellaPlaced) {
            const player = Player.getPlayer();
            const umberella = World
                .getAllEntitiesOfType(EntityArmorStand)
                .filter(as => as.distanceTo(player) <= umberellaDistance && as.getName()?.removeFormatting()?.startsWith('Umberella'));// && as.getX() === umberellaX && as.getZ() === umberellaZ);

            if (!umberella.length) {
                //ChatLib.chat('Return');

                return;
            }

            ChatLib.chat('' + umberella[0].getX() + ' ' + umberella[0].getZ());

            umberellaTimerRemainingSeconds = +(umberella[0].getName()?.removeFormatting()?.split(' ')[1].replace('s', ''));
            if (umberellaTimerRemainingSeconds < 1) {
                resetUmberella();
            }

            if (settings.alertOnFlareExpiresSoon && umberellaTimerRemainingSeconds === secondsBeforeExpiration) { // TODO
                Client.showTitle(`${BLUE}Umberella ${RED}expires soon`, '', 1, 30, 1);
                ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Your ${BLUE}Umberella ${WHITE}expires soon.`);
    
                if (settings.soundMode !== OFF_SOUND_MODE)
                {
                    new Sound(TIMER_SOUND_SOURCE).play();
                }
            }
        }    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track umberella status.`);
	}
}

function resetUmberella() {
    if (!isUmberellaPlaced) {
        return;
    }

    isUmberellaPlaced = false;
    lastUmberellaPlacedAt = null;
    umberellaTimerRemainingSeconds = null;
    umberellaX = null;
    umberellaZ = null;
}

function renderUmberellaOverlay() {
    if (!settings.flareRemainingTimeOverlay ||
        !isUmberellaPlaced ||
        umberellaTimerRemainingSeconds <= 0 ||
        !isInSkyblock() ||
        allOverlaysGui.isOpen()
    ) {
        return;
    }

    const timerColor = umberellaTimerRemainingSeconds <= secondsBeforeExpiration ? RED : WHITE;
    const minutes = ~~((umberellaTimerRemainingSeconds % 3600) / 60);
    const seconds = ~~umberellaTimerRemainingSeconds % 60;
    const text = minutes > 0 ? `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s` : `${seconds.toString().padStart(2, '0')}s`;
    const overlayText = `${BLUE}Umberella: ${timerColor}${text}`;
    const overlay = new Text(`${overlayText}`, overlayCoordsData.flareRemainingTimeOverlay.x, overlayCoordsData.flareRemainingTimeOverlay.y) // TODO
        .setShadow(true)
        .setScale(overlayCoordsData.flareRemainingTimeOverlay.scale);
    overlay.draw();
}

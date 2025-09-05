import settings, { allOverlaysGui } from "../../settings";
import { overlayCoordsData } from "../../data/overlayCoords";
import { EntityArmorStand } from "../../constants/javaTypes";
import { TIMER_SOUND_SOURCE, OFF_SOUND_MODE } from "../../constants/sounds";
import { WHITE, RED, DARK_PURPLE, GOLD, BLUE } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { getMcEntityById, getMcEntityId } from "../../utils/common";

// TODO: Player's umberella only
// TODO: Alerts
// TODO Flares

const currentPlayer = Player.getName();
const secondsBeforeExpiration = 10;

let remainingTimes = {
    totem: {
        remainingTime: null, // Format examples: 01m 02s, 50s, 09s
        lastAlertAt: null // Prevent alerting 2 times when register rarely triggers twice per second
    },
    blackHole: {
        remainingTime: null, // Format examples: 170s
        lastAlertAt: null
    },
    umberella: {
        remainingTime: null, // Format examples: 295s
        lastAlertAt: null,
        //lastPlacedAt: null,
        id: null
    },
};

registerIf(
    register('step', () => trackDeployablesStatus()).setFps(1),
    () => isInSkyblock() &&
        (
            settings.alertOnTotemExpiresSoon ||
            isOverlayEnabled()
        )
);

registerIf( // Some deployables have no player name in armor stand, so we need to track deployables placed by player
    register("playerInteract", (action, pos, event) => handleDeployableInteraction(action)),
    () => (settings.alertOnTotemExpiresSoon || (settings.deployablesRemainingTimeOverlay && settings.remainingTimeUmberella)) && isInSkyblock()
);

registerIf(
    register('renderOverlay', () => renderOverlay()),
    () => isOverlayEnabled() && isInSkyblock()
);

register("worldUnload", () => {
    resetTotem();
    resetBlackHole();
    resetUmberella();
});

function isOverlayEnabled() {
    return settings.deployablesRemainingTimeOverlay && (settings.remainingTimeTotem || settings.remainingTimeBlackHole || settings.remainingTimeUmberella);
}

function resetTotem() {
    remainingTimes.totem.remainingTime = null;
    remainingTimes.totem.lastAlertAt = null;
}

function resetBlackHole() {
    remainingTimes.blackHole.remainingTime = null;
    remainingTimes.blackHole.lastAlertAt = null;
}

function resetUmberella() {
    remainingTimes.umberella.remainingTime = null;
    remainingTimes.umberella.lastAlertAt = null;
    remainingTimes.umberella.id = null;
}

function trackDeployablesStatus() {
    const entities = World.getAllEntitiesOfType(EntityArmorStand);
    trackTotemStatus(entities);
    trackBlackHoleStatus(entities);
    trackUmberellaStatus(entities);
}

function handleDeployableInteraction(action) {
    try {
        if ((!settings.alertOnFlareExpiresSoon && !settings.flareRemainingTimeOverlay) ||
            !isInSkyblock ||
            !action.toString().includes('RIGHT_CLICK')
            //new Date() - lastFlarePlacedAt < 500 // sometimes playerInteract event happens multiple times
        ) {
            return;
        }

        const heldItemName = Player.getHeldItem()?.getName();
        const isUmberella = heldItemName?.includes('Umberella');
        if (isUmberella) {
            setTimeout(function() {
                const entities = World.getAllEntitiesOfType(EntityArmorStand);
                const umberellaArmorStand = entities.find(entity => {
                    return entity.distanceTo(Player.getPlayer()) <= 4 && entity?.getName()?.removeFormatting() === 'Umberella 300s'
                });
                if (!umberellaArmorStand) return;

                //remainingTimes.umberella.lastPlacedAt = new Date();
                remainingTimes.umberella.id = getMcEntityId(umberellaArmorStand);
            }, 250); // Give time for a Umberella to appear after click
        }     
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to handle deployable interaction.`);
	}
}

function trackTotemStatus(entities) {
    try {
        if (!isInSkyblock() || !entities || (!settings.alertOnTotemExpiresSoon && !settings.deployablesRemainingTimeOverlay && !settings.remainingTimeTotem)) {
            return;
        }

        const ownerArmorStand = entities.find(entity => {
            const name = entity?.getName()?.removeFormatting();
            return name.includes('Owner:') && name.includes(currentPlayer);
        });
        if (!ownerArmorStand) {
            resetTotem();
            return;
        }
    
        const ownerArmorStandId = getMcEntityId(ownerArmorStand);
        const totemArmorStand = getMcEntityById(ownerArmorStandId - 2);
        if (!totemArmorStand || !(totemArmorStand instanceof EntityArmorStand)) return;
    
        const totemArmorStandName = totemArmorStand.func_95999_t()?.removeFormatting(); // func_95999_t -> getCustomNameTag()
        if (totemArmorStandName !== 'Totem of Corruption') {
            resetTotem();
            return;
        }
    
        const remainingArmorStand = getMcEntityById(ownerArmorStandId - 1);
        if (!remainingArmorStand || !(remainingArmorStand instanceof EntityArmorStand)) return;
    
        const remainingArmorStandName = remainingArmorStand.func_95999_t()?.removeFormatting(); // func_95999_t -> getCustomNameTag()
        if (!remainingArmorStandName?.includes('Remaining: ')) {
            resetTotem();
            return;
        }
    
        remainingTimes.totem.remainingTime = remainingArmorStandName.split('Remaining: ').pop();

        playAlertOnExpiration();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Totem status.`);
	}

    function playAlertOnExpiration() {
        if (!settings.alertOnTotemExpiresSoon ||
            remainingTimes.totem.remainingTime !== `${secondsBeforeExpiration}s` ||
            (remainingTimes.totem.lastAlertAt && new Date() - remainingTimes.totem.lastAlertAt < 1000)) {
            return;
        }

        playAlert(`${DARK_PURPLE}Totem of Corruption`, remainingTimes.totem);
    }
}

function trackBlackHoleStatus(entities) {
    try {
        if (!isInSkyblock() || !entities || (!settings.alertOnTotemExpiresSoon && !settings.deployablesRemainingTimeOverlay && !settings.remainingTimeBlackHole)) {
            return;
        }

        const ownerArmorStand = entities.find(entity => {
            const name = entity?.getName()?.removeFormatting();
            return name.includes('Spawned by:') && name.includes(currentPlayer);
        });

        if (!ownerArmorStand) {
            resetBlackHole();
            return;
        }
    
        const ownerArmorStandId = getMcEntityId(ownerArmorStand);
        const blackHoleArmorStand = getMcEntityById(ownerArmorStandId + 1);
        if (!blackHoleArmorStand || !(blackHoleArmorStand instanceof EntityArmorStand)) return;
    
        const blackHoleArmorStandName = blackHoleArmorStand.func_95999_t()?.removeFormatting(); // func_95999_t -> getCustomNameTag()
        if (!blackHoleArmorStandName.startsWith('Black Hole')) {
            resetBlackHole();
            return;
        }
    
        const parts = blackHoleArmorStandName.split('Black Hole').filter(Boolean); // When Black Hole is placed, it has no timer for a second
        const seconds = parts.length ? +(parts[0].replace('s', '')) : 180;
        remainingTimes.blackHole.remainingTime = formatTime(seconds);

        playAlertOnExpiration();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Black Hole status.`);
	}

    function playAlertOnExpiration() {
        if (!settings.alertOnTotemExpiresSoon ||
            remainingTimes.blackHole.remainingTime !== `${secondsBeforeExpiration}s` ||
            (remainingTimes.blackHole.lastAlertAt && new Date() - remainingTimes.blackHole.lastAlertAt < 1000)) {
            return;
        }

        playAlert(`${DARK_PURPLE}Black Hole`, remainingTimes.blackHole);
    }
}

function trackUmberellaStatus(entities) {
    try {
        if (!isInSkyblock() || !entities || (!settings.alertOnTotemExpiresSoon && !settings.deployablesRemainingTimeOverlay && !settings.remainingTimeUmberella)) {
            return;
        }

        const umberellaArmorStand = entities.find(entity => {
            return entity?.getName()?.removeFormatting().startsWith('Umberella ') && getMcEntityId(entity) === remainingTimes.umberella.id
        });

        if (!umberellaArmorStand) {
            resetUmberella();
            return;
        }
    
        const seconds = +(umberellaArmorStand.getName().removeFormatting().split('Umberella ').pop().replace('s', ''));
        remainingTimes.umberella.remainingTime = formatTime(seconds);

        playAlertOnExpiration();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Umberella status.`);
	}

    function playAlertOnExpiration() {
        if (!settings.alertOnTotemExpiresSoon ||
            remainingTimes.umberella.remainingTime !== `${secondsBeforeExpiration}s` ||
            (remainingTimes.umberella.lastAlertAt && new Date() - remainingTimes.umberella.lastAlertAt < 1000)) {
            return;
        }

        playAlert(`${BLUE}Umberella`, remainingTimes.umberella);
    }
}

function playAlert(itemDisplayName, obj) {
    Client.showTitle(`${itemDisplayName} ${RED}expires soon`, '', 1, 30, 1);
    ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Your ${itemDisplayName} ${WHITE}expires soon.`);
    obj.lastAlertAt = new Date();

    if (settings.soundMode !== OFF_SOUND_MODE)
    {
        new Sound(TIMER_SOUND_SOURCE).play();
    }
}

function formatTime(totalSeconds) {
    if (!totalSeconds) return '';
    const minutes = ~~((totalSeconds % 3600) / 60);
    const seconds = ~~totalSeconds % 60;
    const text = minutes > 0 ? `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s` : `${seconds.toString().padStart(2, '0')}s`;
    return text;
}

function renderOverlay() {
    if (!settings.deployablesRemainingTimeOverlay || !isInSkyblock() || allOverlaysGui.isOpen()) {
        return;
    }

    let overlayText = '';

    if (settings.remainingTimeTotem && remainingTimes.totem.remainingTime && remainingTimes.totem.remainingTime !== '00s') {
        const timerColor = !remainingTimes.totem.remainingTime.includes('m') && remainingTimes.totem.remainingTime.slice(0, -1) <= secondsBeforeExpiration ? RED : WHITE;
        overlayText += `${DARK_PURPLE}Totem of Corruption: ${timerColor}${remainingTimes.totem.remainingTime}\n`;    
    }

    if (settings.remainingTimeBlackHole && remainingTimes.blackHole.remainingTime) {
        const timerColor = remainingTimes.blackHole.remainingTime.slice(0, -1) <= secondsBeforeExpiration ? RED : WHITE;
        overlayText += `${DARK_PURPLE}Black Hole: ${timerColor}${remainingTimes.blackHole.remainingTime}\n`;    
    }

    if (settings.remainingTimeUmberella && remainingTimes.umberella.remainingTime) {
        const timerColor = remainingTimes.umberella.remainingTime.slice(0, -1) <= secondsBeforeExpiration ? RED : WHITE;
        overlayText += `${BLUE}Umberella: ${timerColor}${remainingTimes.umberella.remainingTime}\n`;    
    }

    if (overlayText) {
        const overlay = new Text(overlayText, overlayCoordsData.deployablesRemainingTimeOverlay.x, overlayCoordsData.deployablesRemainingTimeOverlay.y)
            .setShadow(true)
            .setScale(overlayCoordsData.deployablesRemainingTimeOverlay.scale);
        overlay.draw();
    }
}

import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import { overlayCoordsData } from "../../data/overlayCoords";
import { EntityArmorStand, EntityFireworkRocket } from "../../constants/javaTypes";
import { TIMER_SOUND_SOURCE, OFF_SOUND_MODE } from "../../constants/sounds";
import { WHITE, RED, DARK_PURPLE, GOLD, BLUE } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { getMcEntityById, getMcEntityId } from "../../utils/common";

// TODO no SOS flare alert
// TODO check settings untoggled
// TODO check other players items

const currentPlayer = Player.getName();
const secondsBeforeExpiration = 10;

let remainingTimes = {
    totem: {
        remainingTime: null, // Format examples: 01m 02s, 50s, 09s
        lastAlertAt: null // Prevent alerting 2 times when register rarely triggers twice per second
    },
    blackHole: {
        remainingTime: null,
        lastAlertAt: null
    },
    umberella: {
        remainingTime: null,
        lastAlertAt: null,
        id: null
    },
    flare: {
        remainingSeconds: null,
        remainingTime: null,
        lastAlertAt: null,
        lastPlacedAt: null,
        itemName: null
    }
};

registerIf(
    register('step', () => trackDeployablesStatus()).setFps(1),
    () => isInSkyblock() && (isAnyAlertEnabled() || isOverlayEnabled())
);

// Those deployables have no player name in their nametag, so we need to track item interaction to detect current player's deployable and ignore deployables from others.
registerIf(
    register("playerInteract", (action, pos, event) => handleDeployableInteraction(action)),
    () => (
        isInSkyblock() &&
        (settings.alertOnDeployableExpiresSoon && (settings.alertOnUmberellaExpiresSoon || settings.alertOnFlareExpiresSoon)) ||
        (settings.deployablesRemainingTimeOverlay && (settings.remainingTimeUmberella || settings.remainingTimeFlare))
    )
);

registerIf(
    register("chat", () => resetFlare()).setCriteria(triggers.FLARE_DISAPPEARED).setStart(),
    () => settings.alertOnDeployableExpiresSoon && (settings.alertOnFlareExpiresSoon || settings.remainingTimeFlare) && isInSkyblock()
);

registerIf(
    register("chat", () => resetFlare()).setCriteria(triggers.FLARE_REMOVED).setStart(),
    () => settings.alertOnDeployableExpiresSoon && (settings.alertOnFlareExpiresSoon || settings.remainingTimeFlare) && isInSkyblock()
);

registerIf(
    register('renderOverlay', () => renderOverlay()),
    () => isOverlayEnabled() && isInSkyblock()
);

register("worldUnload", () => {
    resetTotem();
    resetBlackHole();
    resetUmberella();
    resetFlare();
});

function isOverlayEnabled() {
    return settings.deployablesRemainingTimeOverlay && (settings.remainingTimeTotem || settings.remainingTimeBlackHole || settings.remainingTimeUmberella || settings.remainingTimeFlare);
}

function isAnyAlertEnabled() {
    return settings.alertOnDeployableExpiresSoon && (settings.alertOnTotemExpiresSoon || settings.alertOnBlackHoleExpiresSoon || settings.alertOnUmberellaExpiresSoon || settings.alertOnFlareExpiresSoon);
}

function isTotemTrackingEnabled() {
    return (settings.alertOnDeployableExpiresSoon && settings.alertOnTotemExpiresSoon) || (settings.deployablesRemainingTimeOverlay && settings.remainingTimeTotem);
}

function isBlackHoleTrackingEnabled() {
    return (settings.alertOnDeployableExpiresSoon && settings.alertOnBlackHoleExpiresSoon) || (settings.deployablesRemainingTimeOverlay && settings.remainingTimeBlackHole);
}

function isUmberellaTrackingEnabled() {
    return (settings.alertOnDeployableExpiresSoon && settings.alertOnUmberellaExpiresSoon) || (settings.deployablesRemainingTimeOverlay && settings.remainingTimeUmberella);
}

function isFlareTrackingEnabled() {
    return (settings.alertOnDeployableExpiresSoon && settings.alertOnFlareExpiresSoon) || (settings.deployablesRemainingTimeOverlay && settings.remainingTimeFlare);
}

function resetTotem() {
    remainingTimes.totem = {
        remainingTime: null,
        lastAlertAt: null
    };
}

function resetBlackHole() {
    remainingTimes.blackHole = {
        remainingTime: null,
        lastAlertAt: null
    };
}

function resetUmberella() {
    remainingTimes.umberella = {
        remainingTime: null,
        lastAlertAt: null,
        id: null
    };
}

function resetFlare() {
    remainingTimes.flare = {
        remainingSeconds: null,
        remainingTime: null,
        lastAlertAt: null,
        lastPlacedAt: null,
        itemName: null
    };
}

function trackDeployablesStatus() {
    const entities = World.getAllEntitiesOfType(EntityArmorStand);
    trackTotemStatus(entities);
    trackBlackHoleStatus(entities);
    trackUmberellaStatus(entities);
    trackFlareStatus();
}

function handleDeployableInteraction(action) {
    try {
        if (!isInSkyblock() || !action.toString().includes('RIGHT_CLICK')) return;

        const heldItemName = Player.getHeldItem()?.getName();

        if (isUmberellaTrackingEnabled() && heldItemName?.includes('Umberella')) {
            setTimeout(() => trackUmberellaNearby(heldItemName), 250); // Give time for a Umberella to appear after click
        }
        
        if (isFlareTrackingEnabled() && heldItemName?.includes('Flare')) {
            if (new Date() - remainingTimes.flare.lastPlacedAt < 500) return; // sometimes playerInteract event happens multiple times
            setTimeout(() => trackFlareRocketNearby(heldItemName), 500); // Give time for a firework rocket to appear after click
        }  
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to handle deployable interaction.`);
	}

    function trackUmberellaNearby() {
        const player = Player.getPlayer();
        const entities = World.getAllEntitiesOfType(EntityArmorStand);
        const umberellaArmorStand = entities.find(entity => {
            return entity.distanceTo(player) <= 4 && entity?.getName()?.removeFormatting() === 'Umberella 300s'
        });

        if (!umberellaArmorStand) return;

        remainingTimes.umberella.id = umberellaArmorStand.getUUID();
    }

    function trackFlareRocketNearby(heldItemName) {
        const player = Player.getPlayer();
        const flareRockets = World
            .getAllEntitiesOfType(EntityFireworkRocket)
            .filter(rocket => rocket.distanceTo(player) <= 10);
    
        if (flareRockets.length) {
            remainingTimes.flare.remainingSeconds = 180;
            remainingTimes.flare.remainingTime = formatTime(remainingTimes.flare.remainingSeconds);
            remainingTimes.flare.lastPlacedAt = new Date();
            remainingTimes.flare.itemName = heldItemName;
        }
    
        // Future notes: flare itself appears on slightly different coords than the initial rocket
        // e.g. rocket is at 62.01113596669814 -160.09375 and flare (armor stand) is at 62.125 -160.09375
    }    
}

function trackTotemStatus(entities) {
    try {
        if (!isInSkyblock() || !entities || !isTotemTrackingEnabled()) {
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

        if (settings.alertOnDeployableExpiresSoon &&
            settings.alertOnTotemExpiresSoon &&
            remainingTimes.totem.remainingTime === `${secondsBeforeExpiration}s` &&
            (!remainingTimes.totem.lastAlertAt || new Date() - remainingTimes.totem.lastAlertAt >= 1000)
        ) {
            playAlert(`${DARK_PURPLE}Totem of Corruption`, remainingTimes.totem);
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Totem status.`);
	}
}

function trackBlackHoleStatus(entities) {
    try {
        if (!isInSkyblock() || !entities || !isBlackHoleTrackingEnabled()) {
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

        if (settings.alertOnDeployableExpiresSoon &&
            settings.alertOnBlackHoleExpiresSoon &&
            remainingTimes.blackHole.remainingTime === `${secondsBeforeExpiration}s` &&
            (!remainingTimes.blackHole.lastAlertAt || new Date() - remainingTimes.blackHole.lastAlertAt >= 1000)
        ) {
            playAlert(`${DARK_PURPLE}Black Hole`, remainingTimes.blackHole);
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Black Hole status.`);
	}
}

function trackUmberellaStatus(entities) {
    try {
        if (!isInSkyblock() || !entities || !isUmberellaTrackingEnabled()) {
            return;
        }

        const umberellaArmorStand = entities.find(entity => {
            return entity?.getName()?.removeFormatting().startsWith('Umberella ') && entity.getUUID() === remainingTimes.umberella.id
        });

        if (!umberellaArmorStand) {
            resetUmberella();
            return;
        }
    
        const seconds = +(umberellaArmorStand.getName().removeFormatting().split('Umberella ').pop().replace('s', ''));
        remainingTimes.umberella.remainingTime = formatTime(seconds);

        if (settings.alertOnDeployableExpiresSoon &&
            settings.alertOnUmberellaExpiresSoon &&
            remainingTimes.umberella.remainingTime === `${secondsBeforeExpiration}s` &&
            (!remainingTimes.umberella.lastAlertAt || new Date() - remainingTimes.umberella.lastAlertAt >= 1000)
        ) {
            playAlert(`${BLUE}Umberella`, remainingTimes.umberella);
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Umberella status.`);
	}
}

function trackFlareStatus() {
    try {
        if (!isInSkyblock() || !isFlareTrackingEnabled()) {
            return;
        }

        if (remainingTimes.flare.remainingSeconds <= 0) {
            resetFlare();
        }
    
        if (remainingTimes.flare.remainingSeconds) {
            remainingTimes.flare.remainingSeconds -= 1;
            remainingTimes.flare.remainingTime = formatTime(remainingTimes.flare.remainingSeconds);
    
            if (settings.alertOnDeployableExpiresSoon && 
                settings.alertOnFlareExpiresSoon &&
                remainingTimes.flare.remainingSeconds === secondsBeforeExpiration &&
                (!remainingTimes.flare.lastAlertAt || new Date() - remainingTimes.flare.lastAlertAt >= 1000)
            ) {
                playAlert(remainingTimes.flare.itemName, remainingTimes.flare);
            }
        }    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Flare status.`);
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

    if (settings.remainingTimeUmberella && remainingTimes.umberella.remainingTime) {
        const timerColor = remainingTimes.umberella.remainingTime.slice(0, -1) <= secondsBeforeExpiration ? RED : WHITE;
        overlayText += `${BLUE}Umberella: ${timerColor}${remainingTimes.umberella.remainingTime}\n`;    
    }

    if (settings.remainingTimeFlare && remainingTimes.flare.remainingTime) {
        const timerColor = remainingTimes.flare.remainingSeconds <= secondsBeforeExpiration ? RED : WHITE;
        overlayText += `${remainingTimes.flare.itemName}: ${timerColor}${remainingTimes.flare.remainingTime}\n`;    
    }

    if (settings.remainingTimeBlackHole && remainingTimes.blackHole.remainingTime) {
        const timerColor = remainingTimes.blackHole.remainingTime.slice(0, -1) <= secondsBeforeExpiration ? RED : WHITE;
        overlayText += `${DARK_PURPLE}Black Hole: ${timerColor}${remainingTimes.blackHole.remainingTime}\n`;    
    }

    if (settings.remainingTimeTotem && remainingTimes.totem.remainingTime && remainingTimes.totem.remainingTime !== '00s') {
        const timerColor = !remainingTimes.totem.remainingTime.includes('m') && remainingTimes.totem.remainingTime.slice(0, -1) <= secondsBeforeExpiration ? RED : WHITE;
        overlayText += `${DARK_PURPLE}Totem of Corruption: ${timerColor}${remainingTimes.totem.remainingTime}\n`;    
    }

    if (overlayText) {
        const overlay = new Text(overlayText, overlayCoordsData.deployablesRemainingTimeOverlay.x, overlayCoordsData.deployablesRemainingTimeOverlay.y)
            .setShadow(true)
            .setScale(overlayCoordsData.deployablesRemainingTimeOverlay.scale);
        overlay.draw();
    }
}

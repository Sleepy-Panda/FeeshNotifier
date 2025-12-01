import settings, { allOverlaysGui } from "../../settings";
import { BOLD, RED, YELLOW } from "../../constants/formatting";
import { getPlayerFishingHook, isInFishingWorld, logError } from "../../utils/common";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { overlayCoordsData } from "../../data/overlayCoords";
import { FISH_STATE_ARRIVED, FISH_STATE_ARRIVING, FISH_STATE_NONE } from "../../constants/fishingHookStates";
import { getHypixelFishingHookTimer } from "../../utils/entityDetection";

let fishingHookTimer = null;

const DEFAULT_FISH_ARRIVED_TEMPLATE = `${RED}${BOLD}!!!`;
const DEFAULT_TIMER_TEMPLATE = `${YELLOW}${BOLD}{timer}`;

const UNTIL_REEL_IN_MODE = 0;
const SINCE_CASTED_MODE = 1;

registerIf(
    register('tick', () => trackHypixelFishingHookTimer()),
    () => settings.fishingHookTimerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register('renderOverlay', () => renderOverlay()),
    () => settings.fishingHookTimerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register("renderEntity", (entity, partialTick, event) => cancelHypixelFishingHookTimer(entity, event)),
    () => settings.fishingHookTimerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

register("worldUnload", () => {
    fishingHookTimer = null;
});

function trackHypixelFishingHookTimer() {
    try {
        if (!settings.fishingHookTimerOverlay || !isInSkyblock() || !isInFishingWorld(getWorldName()) || !hasFishingRodInHotbar()) {
            fishingHookTimer = null;
            return;
        }
    
        const fishingHook = getPlayerFishingHook();
        if (!fishingHook) {
            fishingHookTimer = null;
            return;
        }
    
        const fishingHookMc = fishingHook.toMC();

        fishingHookTimer = {
            ticksExisted: fishingHookMc.age,
            fishState: FISH_STATE_NONE
        };

        const hypixelHookTimer = getHypixelFishingHookTimer(fishingHook);
        if (!hypixelHookTimer) return;

        fishingHookTimer = Object.assign(fishingHookTimer, {
            hypixelTimerUuid: hypixelHookTimer.uuid,
            fishState: hypixelHookTimer.fishState,
            hypixelTimerText: hypixelHookTimer.name,
        });    
    } catch (e) {
        logError(e, 'Failed to track Hypixel\'s fishing hook timer.');
    }
}

function cancelHypixelFishingHookTimer(entity, event) {
    try {
        if (!entity ||
            !event ||
            !fishingHookTimer ||
            !fishingHookTimer.hypixelTimerUuid ||
            !settings.fishingHookTimerOverlay ||
            !isInSkyblock() ||
            !isInFishingWorld(getWorldName()) ||
            !hasFishingRodInHotbar()
        ) {
            return;
        }

        if (entity.getUUID() === fishingHookTimer.hypixelTimerUuid){
            cancel(event);
        }
    } catch (e) {
        logError(e, 'Failed to cancel rendering of Hypixel\'s fishing hook timer.');
    }
}

function renderOverlay() {
    if (!fishingHookTimer ||
        !settings.fishingHookTimerOverlay ||
        !isInSkyblock() ||
        !hasFishingRodInHotbar() ||
        !isInFishingWorld(getWorldName()) ||
        allOverlaysGui.isOpen()
    ) {
        return;
    }

    let text = '';
    switch (true) {
        case fishingHookTimer.fishState === FISH_STATE_ARRIVED: {
            text = settings.fishingHookFishArrivedTemplate || DEFAULT_FISH_ARRIVED_TEMPLATE;
            break;
        }
        
        case fishingHookTimer.fishState === FISH_STATE_ARRIVING && settings.fishingHookTimerMode === UNTIL_REEL_IN_MODE: {
            const template = settings.fishingHookFishTimerTemplate || DEFAULT_TIMER_TEMPLATE;
            text = template.replace('{timer}', fishingHookTimer.hypixelTimerText.removeFormatting());
            break;
        }

        case settings.fishingHookTimerMode === SINCE_CASTED_MODE: {
            const template = settings.fishingHookFishTimerTemplate || DEFAULT_TIMER_TEMPLATE;
            const seconds = (fishingHookTimer.ticksExisted / 20).toFixed(1);
            text = template.replace('{timer}', seconds);
            break;
        }

        default:
            break;
    }  

    if (!text) return;

    const overlay = new Text(text, overlayCoordsData.fishingHookTimerOverlay.x, overlayCoordsData.fishingHookTimerOverlay.y)
        .setShadow(true)
        .setAlign('CENTER')
        .setScale(overlayCoordsData.fishingHookTimerOverlay.scale);
    overlay.draw();
}

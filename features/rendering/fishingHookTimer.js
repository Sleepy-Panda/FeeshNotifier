import settings from "../../settings";
import { BOLD, RED, YELLOW } from "../../constants/formatting";
import { getPlayerFishingHook, isInFishingWorld } from "../../utils/common";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { drawString } from "../../utils/worldRendering";
import { FISH_STATE_ARRIVED, FISH_STATE_ARRIVING, FISH_STATE_NONE } from "../../constants/fishingHookStates";
import { getHypixelFishingHookTimer } from "../../utils/entityDetection";

let fishingHookTimer = null;

const DEFAULT_FISH_ARRIVED_TEMPLATE = `${RED}${BOLD}!!!`;
const DEFAULT_TIMER_TEMPLATE = `${YELLOW}${BOLD}{timer}`;

registerIf(
    register('tick', () => trackHypixelFishingHookTimer()),
    () => settings.renderFishingHookTimer && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register("renderWorld", (partialTick) => drawFishingHook(partialTick)),
    () => settings.renderFishingHookTimer && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register("renderEntity", (entity, partialTick, event) => cancelHypixelFishingHookTimer(entity, event)),
    () => settings.renderFishingHookTimer && isInSkyblock() && isInFishingWorld(getWorldName())
);

register("worldUnload", () => {
    fishingHookTimer = null;
});

function trackHypixelFishingHookTimer() {
    try {
        if (!settings.renderFishingHookTimer || !isInSkyblock() || !isInFishingWorld(getWorldName()) || !hasFishingRodInHotbar()) {
            fishingHookTimer = null;
            return;
        }
    
        const fishingHook = getPlayerFishingHook();
        if (!fishingHook) {
            fishingHookTimer = null;
            return;
        }
    
        fishingHookTimer = {
            ticksExisted: fishingHook.getTicksExisted(),
            x: fishingHook.getX(),
            y: fishingHook.getY(),
            z: fishingHook.getZ(),
            lastX: fishingHook.getLastX(),
            lastY: fishingHook.getLastY(),
            lastZ: fishingHook.getLastZ(),
            fishState: FISH_STATE_NONE
        };
    
        const hypixelHookTimer = getHypixelFishingHookTimer(fishingHook);
        if (!hypixelHookTimer) {
            return;
        }
    
        fishingHookTimer = Object.assign(fishingHookTimer, { hypixelTimerUuid: hypixelHookTimer.uuid, fishState: hypixelHookTimer.fishState, hypixelTimerText: hypixelHookTimer.name });    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Hypixel's fishing hook.`);
    }
}

function cancelHypixelFishingHookTimer(entity, event) {
    try {
        if (!entity ||
            !event ||
            !fishingHookTimer ||
            !fishingHookTimer.hypixelTimerUuid ||
            !settings.renderFishingHookTimer ||
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
		console.error(e);
		console.log(`[FeeshNotifier] Failed to cancel rendering of Hypixel's fishing hook.`);
    }
}

function drawFishingHook(partialTick) {
    try {
        if (!fishingHookTimer || !settings.renderFishingHookTimer || !isInSkyblock() || !isInFishingWorld(getWorldName()) || !hasFishingRodInHotbar()) return;
    
        const x = getRenderCoordinate(fishingHookTimer.lastX, fishingHookTimer.x, partialTick);
        const y = getRenderCoordinate(fishingHookTimer.lastY, fishingHookTimer.y, partialTick) + 0.5;
        const z = getRenderCoordinate(fishingHookTimer.lastZ, fishingHookTimer.z, partialTick);
        const scale = settings.renderFishingHookTimerSize / 100;
    
        switch (true) {
            case fishingHookTimer.fishState === FISH_STATE_ARRIVED: {
                const text = settings.renderFishingHookFishArrivedTemplate || DEFAULT_FISH_ARRIVED_TEMPLATE;
                drawString(text, x, y, z, 0xffffff, false, scale, false, true, true);
                break;
            }
            
            case fishingHookTimer.fishState === FISH_STATE_ARRIVING && settings.renderFishingHookTimerMode === 0: { // Countdown until reel in   
                const template = settings.renderFishingHookFishTimerTemplate || DEFAULT_TIMER_TEMPLATE;
                const text = template.replace('{timer}', fishingHookTimer.hypixelTimerText.removeFormatting());
                drawString(text, x, y, z, 0xffffff, false, scale, false, true, true);
                break;
            }
    
            case settings.renderFishingHookTimerMode === 1: { // Since casted
                const template = settings.renderFishingHookFishTimerTemplate || DEFAULT_TIMER_TEMPLATE;
                const seconds = (fishingHookTimer.ticksExisted / 20).toFixed(1);
                const text = template.replace('{timer}', seconds);
                drawString(text, x, y, z, 0xffffff, false, scale, false, true, true);
                break;
            }
    
            default:
                break;
        }    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to draw custom fishing hook timer.`);
    }
}

// This allows more smooth rendering while moving
function getRenderCoordinate(last, current, partialTick) {
    return last + (current - last) * partialTick
}

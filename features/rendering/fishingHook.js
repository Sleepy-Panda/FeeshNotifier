import settings from "../../settings";
import { BOLD, RED, YELLOW } from "../../constants/formatting";
import { getPlayerFishingHook, isInFishingWorld } from "../../utils/common";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { drawString } from "../../utils/worldRendering";
import { FISH_STATE_ARRIVED, FISH_STATE_ARRIVING, FISH_STATE_NONE } from "../../constants/fishingHookStates";
import { getHypixelFishingHookTimer } from "../../utils/entityDetection";

// Stick overlay to specific position on screen
// Or just render bigger on original hook position?

// lastPos + (currentPos - lastPos) * partialTicks

let fishingHookTimer = null;

const DEFAULT_FISH_ARRIVED_TEMPLATE = `${RED}${BOLD}!`;
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
    register("renderEntity", (entity, position, partialTick, event) => cancelHypixelFishingHookTimer(entity, event)),
    () => settings.renderFishingHookTimer && isInSkyblock() && isInFishingWorld(getWorldName())
);

register("worldUnload", () => {
    fishingHookTimer = null;
});

function trackHypixelFishingHookTimer() {
    // Try catch
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
}

function cancelHypixelFishingHookTimer(entity, event) {
    if (!settings.renderFishingHookTimer || !isInSkyblock() || !isInFishingWorld(getWorldName()) || !hasFishingRodInHotbar()) return;
    if (entity && fishingHookTimer && fishingHookTimer.hypixelTimerUuid && entity.getUUID() === fishingHookTimer.hypixelTimerUuid) cancel(event);
}

function drawFishingHook(partialTick) {
    if (!settings.renderFishingHookTimer || !isInSkyblock() || !isInFishingWorld(getWorldName()) || !hasFishingRodInHotbar()) return;

    if (!fishingHookTimer) return;

    const x = fishingHookTimer.lastX + (fishingHookTimer.x - fishingHookTimer.lastX) * partialTick;
    const y = fishingHookTimer.lastY + (fishingHookTimer.y - fishingHookTimer.lastY) * partialTick;
    const z = fishingHookTimer.lastZ + (fishingHookTimer.z - fishingHookTimer.lastZ) * partialTick;
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
    };
}

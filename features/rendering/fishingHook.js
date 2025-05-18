import settings from "../../settings";
import { BOLD, RED, YELLOW } from "../../constants/formatting";
import { EntityArmorStand } from "../../constants/javaTypes";
import { getPlayerFishingHook, isInFishingWorld } from "../../utils/common";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { drawString } from "../../utils/worldRendering";

// Stick overlay to specific position on screen
// Or just render bigger on original hook position?

// lastPos + (currentPos - lastPos) * partialTicks

let fishingHookTimer = null;

const FISH_ARRIVED = '§c§l!!!';
const FISHING_TIME_UNTIL_REEL_IN_REGEX = /§e§l(\d+(\\.\d+)?)/;

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

    const entities = World.getAllEntitiesOfType(EntityArmorStand);
	const hypixelHookTimer = entities
		.filter(entity => entity.distanceTo(fishingHook) <= 1)
		.find(e => e.getName() === FISH_ARRIVED || FISHING_TIME_UNTIL_REEL_IN_REGEX.test(e.getName()));

    if (!hypixelHookTimer) {
        fishingHookTimer = null;
        return;
    }

    fishingHookTimer = {
        uuid: hypixelHookTimer.getUUID(),
        ticksExisted: hypixelHookTimer.getTicksExisted(),
        name: hypixelHookTimer.getName(),
        lastX: hypixelHookTimer.getLastX(),
        lastY: hypixelHookTimer.getLastY(),
        lastZ: hypixelHookTimer.getLastZ(),
        x: hypixelHookTimer.getX(),
        y: hypixelHookTimer.getY(),
        z: hypixelHookTimer.getZ(),
    };
}

function cancelHypixelFishingHookTimer(entity, event) {
    if (!settings.renderFishingHookTimer || !isInSkyblock() || !isInFishingWorld(getWorldName()) || !hasFishingRodInHotbar()) return;
    if (entity && fishingHookTimer && entity.getUUID() === fishingHookTimer.uuid) cancel(event);
}

function drawFishingHook(partialTick) {
    if (!settings.renderFishingHookTimer || !isInSkyblock() || !isInFishingWorld(getWorldName()) || !hasFishingRodInHotbar()) return;

    if (!fishingHookTimer) return;

    const x = fishingHookTimer.lastX + (fishingHookTimer.x - fishingHookTimer.lastX) * partialTick;
    const y = fishingHookTimer.lastY + (fishingHookTimer.y - fishingHookTimer.lastY) * partialTick;
    const z = fishingHookTimer.lastZ + (fishingHookTimer.z - fishingHookTimer.lastZ) * partialTick;

    if (fishingHookTimer.name === FISH_ARRIVED) {
        drawString(
            settings.renderFishingHookFishArrivedTemplate || DEFAULT_FISH_ARRIVED_TEMPLATE,
            x,
            y,
            z,
            0xffffff,
            false,
            0.1,
            false,
            true,
            true
        );
    } else if (FISHING_TIME_UNTIL_REEL_IN_REGEX.test(fishingHookTimer.name)) {
        const template = settings.renderFishingHookFishTimerTemplate || DEFAULT_TIMER_TEMPLATE;
        const text = template.replace('{timer}', fishingHookTimer.name.removeFormatting());
        drawString(
            text,
            x,
            y,
            z,
            0xffffff,
            false,
            0.1,
            false,
            true,
            true
        );
    }
}

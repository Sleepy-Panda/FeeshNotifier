import settings, { allOverlaysGui } from "../../settings";
import { BOLD, GRAY, GREEN, LIGHT_PURPLE, WHITE } from "../../constants/formatting";
import { EntityFishHook } from "../../constants/javaTypes";
import { overlayCoordsData } from "../../data/overlayCoords";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { getPlayerNamesInRange } from "../../utils/entityDetection";
import { registerIf } from "../../utils/registers";
import { isInFishingWorld } from "../../utils/common";

let playersCount = 0;
let fishingHooksCount = 0;

const legionDistance = 30;
const maxLegionCount = 20;
const bobbingTimeDistance = 30;
const maxBobbingTimeCount = 5;

registerIf(
    register('step', () => trackPlayersAndFishingHooksNearby()).setFps(2),
    () => settings.legionAndBobbingTimeOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register('renderOverlay', () => renderLegionAndBobbingTimeOverlay()),
    () => settings.legionAndBobbingTimeOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

register("worldUnload", () => {
    playersCount = 0;
    fishingHooksCount = 0;
});

function trackPlayersAndFishingHooksNearby() {
    if (!settings.legionAndBobbingTimeOverlay ||
        !isInSkyblock() ||
        !hasFishingRodInHotbar() ||
        !isInFishingWorld(getWorldName())
    ) {
        return;
    }

    fishingHooksCount = World
        .getAllEntitiesOfType(EntityFishHook)
        .filter(hook =>
            hook.distanceTo(Player.getPlayer()) <= bobbingTimeDistance &&
            !hook.getEntity()?.field_146042_b?.getDisplayNameString()?.includes('Phantom Fisher')) // field_146042_b = angler
        .length;

    const players = getPlayerNamesInRange(legionDistance);
    playersCount = players.length;
}

function renderLegionAndBobbingTimeOverlay() {
    if (!settings.legionAndBobbingTimeOverlay ||
        !isInSkyblock() ||
        !hasFishingRodInHotbar() ||
        !isInFishingWorld(getWorldName()) ||
        allOverlaysGui.isOpen()
    ) {
        return;
    }

    const playersColor = playersCount >= maxLegionCount ? GREEN : WHITE;
    const playersText = `${LIGHT_PURPLE}${BOLD}Legion${GRAY}: ${playersColor}${playersCount} ${GRAY}${playersCount === 1 ? 'player' : 'players'}`;
    const hooksColor = fishingHooksCount >= maxBobbingTimeCount ? GREEN : WHITE;
    const hooksText = `${LIGHT_PURPLE}${BOLD}Bobbin' Time${GRAY}: ${hooksColor}${fishingHooksCount} ${GRAY}${fishingHooksCount === 1 ? 'hook' : 'hooks'}`;
    const overlay = new Text(`${playersText}\n${hooksText}`, overlayCoordsData.legionAndBobbingTimeOverlay.x, overlayCoordsData.legionAndBobbingTimeOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.legionAndBobbingTimeOverlay.scale);
    overlay.draw();
}
import settings, { allOverlaysGui } from "../../settings";
import { GOLD, GRAY, GREEN, WHITE } from "../../constants/formatting";
import { EntityFishHook } from "../../constants/javaTypes";
import { overlayCoordsData } from "../../data/overlayCoords";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { getPlayerNamesInRange } from "../../utils/entityDetection";
import { registerIf } from "../../utils/registers";
import { isInFishingWorld } from "../../utils/common";
import { Overlay, OverlayTextLine } from "../../utils/overlays";

let playersCount = 0;
let fishingHooksCount = 0;

const legionDistance = 30;
const maxLegionCount = 20;
const bobbingTimeDistance = 30;
const maxBobbingTimeCount = 10;

registerIf(
    register('step', () => {
        trackPlayersAndFishingHooksNearby();
        refreshOverlay();
    }).setFps(2),
    () => settings.legionAndBobbingTimeOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

register("worldUnload", () => {
    playersCount = 0;
    fishingHooksCount = 0;
});

const overlay = new Overlay(() => settings.legionAndBobbingTimeOverlay && isInSkyblock() && isInFishingWorld(getWorldName()))
    .setPositionData(overlayCoordsData.legionAndBobbingTimeOverlay)
    .setIsClickable(false);

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

function refreshOverlay() {
    overlay.clear();

    if (!settings.legionAndBobbingTimeOverlay ||
        !isInSkyblock() ||
        !hasFishingRodInHotbar() ||
        !isInFishingWorld(getWorldName()) ||
        allOverlaysGui.isOpen()
    ) {
        return;
    }

    const playersColor = playersCount >= maxLegionCount ? GREEN : WHITE;
    const playersText = `${GOLD}Legion: ${playersColor}${playersCount} ${GRAY}${playersCount === 1 ? 'player' : 'players'}`;
    const hooksColor = fishingHooksCount >= maxBobbingTimeCount ? GREEN : WHITE;
    const hooksText = `${GOLD}Bobbin' time: ${hooksColor}${fishingHooksCount} ${GRAY}${fishingHooksCount === 1 ? 'hook' : 'hooks'}`;

    overlay.addTextLine(new OverlayTextLine().setText(playersText));
    overlay.addTextLine(new OverlayTextLine().setText(hooksText));
}
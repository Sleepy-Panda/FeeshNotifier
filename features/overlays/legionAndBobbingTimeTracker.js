import settings from "../../settings";
import { GOLD, GRAY, WHITE } from "../../constants/formatting";
import { EntityFishHook } from "../../constants/javaTypes";
import { overlayCoordsData } from "../../data/overlayCoords";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { KUUDRA } from "../../constants/areas";
import { getPlayerNamesInRange } from "../../utils/common";

let playersCount = 0;
let fishingHooksCount = 0;

const legionDistance = 30;
const bobbingTimeDistance = 30;

register('step', () => trackPlayersAndFishingHooksNearby()).setFps(2);
register('renderOverlay', () => renderLegionAndBobbingTimeOverlay());
register("worldUnload", () => {
    playersCount = 0;
    fishingHooksCount = 0;
});

function trackPlayersAndFishingHooksNearby() {
    if (!settings.legionAndBobbingTimeOverlay ||
        !isInSkyblock() ||
        !hasFishingRodInHotbar() ||
        getWorldName() === KUUDRA
    ) {
        return;
    }

    fishingHooksCount = World
        .getAllEntitiesOfType(EntityFishHook)
        .filter(hook =>
            hook.distanceTo(Player.getPlayer()) < bobbingTimeDistance &&
            !hook.getEntity()?.field_146042_b?.getDisplayNameString()?.includes('Phantom Fisher')) // field_146042_b = angler
        .length;

    const players = getPlayerNamesInRange(legionDistance);
    playersCount = players.length;
}

function renderLegionAndBobbingTimeOverlay() {
    if (!settings.legionAndBobbingTimeOverlay ||
        !isInSkyblock() ||
        !hasFishingRodInHotbar() ||
        getWorldName() === KUUDRA ||
        settings.allOverlaysGui.isOpen()
    ) {
        return;
    }

    const playersText = `${GOLD}Legion: ${WHITE}${playersCount} ${GRAY}${playersCount === 1 ? 'player' : 'players'}`;
    const hooksText = `${GOLD}Bobbin' time: ${WHITE}${fishingHooksCount} ${GRAY}${fishingHooksCount === 1 ? 'hook' : 'hooks'} α`;
    const overlay = new Text(`${playersText}\n${hooksText}`, overlayCoordsData.legionAndBobbingTimeOverlay.x, overlayCoordsData.legionAndBobbingTimeOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.legionAndBobbingTimeOverlay.scale);
    overlay.draw();
}
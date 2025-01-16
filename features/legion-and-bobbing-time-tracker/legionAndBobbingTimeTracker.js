import settings from "../../settings";
import { GOLD, WHITE } from "../../constants/formatting";
import { EntityFishHook } from "../../constants/javaTypes";
import { overlayCoordsData } from "../../data/overlayCoords";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";

let playersCount = 0;
let fishingHooksCount = 0;

const legionDistance = 30;
const bobbingTimeDistance = 30;

export function trackPlayersAndFishingHooksNearby() {
    if (!settings.legionAndBobbingTimeOverlay ||
        !isInSkyblock() ||
        !hasFishingRodInHotbar() ||
        getWorldName() === 'Kuudra'
    ) {
        return;
    }

    fishingHooksCount = World
        .getAllEntitiesOfType(EntityFishHook)
        .filter(hook => hook.distanceTo(Player.getPlayer()) < bobbingTimeDistance)
        .length;

    const players = World
        .getAllPlayers()
        .filter(player =>
            (player.getUUID().version() === 4 || player.getUUID().version() === 1) && // Players and Watchdog have version 4, nicked players have version 1, this is done to exclude NPCs
            //player.ping > 0 && // Exclude watchdog
            player.name != Player.getName() && // Exclude current player because they do not count for legion
            player.distanceTo(Player.getPlayer()) < legionDistance
        )
        .map(player => player.name)
        .filter((x, i, a) => a.indexOf(x) == i); // Distinct, sometimes the players are duplicated in the list

    playersCount = players.length > 0 ? players.length - 1 : 0; // -1 to exclude watchdog
}

export function renderLegionAndBobbingTimeOverlay() {
    if (!settings.legionAndBobbingTimeOverlay ||
        !isInSkyblock() ||
        !hasFishingRodInHotbar() ||
        getWorldName() === 'Kuudra'
    ) {
        return;
    }

    const playersText = `${GOLD}Legion: ${WHITE}${playersCount} ${playersCount === 1 ? 'player' : 'players'}`;
    const hooksText = `${GOLD}Bobbin' time: ${WHITE}${fishingHooksCount} ${fishingHooksCount === 1 ? 'hook' : 'hooks'} α`;
    const overlay = new Text(`${playersText}\n${hooksText}`, overlayCoordsData.legionAndBobbingTimeOverlay.x, overlayCoordsData.legionAndBobbingTimeOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.legionAndBobbingTimeOverlay.scale);
    overlay.draw();
}
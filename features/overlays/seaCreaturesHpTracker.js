import settings from "../../settings";
import { BOLD, YELLOW } from "../../constants/formatting";
import { EntityArmorStand } from "../../constants/javaTypes";
import { overlayCoordsData } from "../../data/overlayCoords";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { CRIMSON_ISLE, JERRY_WORKSHOP } from "../../constants/areas";

let mobs = [];

register('step', () => trackSeaCreaturesHp()).setFps(4);
register('renderOverlay', () => renderHpOverlay());

function trackSeaCreaturesHp() {
    if (!settings.seaCreaturesHpOverlay ||
        !isInSkyblock() ||
        (getWorldName() !== CRIMSON_ISLE && getWorldName() !== JERRY_WORKSHOP) ||
        !hasFishingRodInHotbar()) {
        return;
    }

    mobs = [];
    const entities = World.getAllEntitiesOfType(EntityArmorStand);

	entities.forEach(entity => {
        const name = entity?.getName();
        const plainName = entity?.getName()?.removeFormatting();

        if (plainName.includes('[Lv') && (plainName.includes('Lord Jawbus') || plainName.includes('Thunder') || plainName.includes('Reindrake'))) {
            mobs.push(name);
        }
    })	
}

function renderHpOverlay() {
    if (!settings.seaCreaturesHpOverlay ||
        !mobs.length ||
        !isInSkyblock() ||
        (getWorldName() !== CRIMSON_ISLE && getWorldName() !== JERRY_WORKSHOP) ||
        !hasFishingRodInHotbar()) {
        return;
    }

    let overlayText = `${YELLOW}${BOLD}Sea creatures HP\n`;
    mobs.forEach((mob) => {
        overlayText += `${mob}\n`;
    });

    const overlay = new Text(overlayText, overlayCoordsData.seaCreaturesHpOverlay.x, overlayCoordsData.seaCreaturesHpOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.seaCreaturesHpOverlay.scale);
    overlay.draw();
}
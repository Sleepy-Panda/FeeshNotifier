import settings from "../../settings";
import { BOLD, YELLOW } from "../../constants/formatting";
import { EntityArmorStand } from "../../constants/javaTypes";
import { overlayCoordsData } from "../../data/overlayCoords";
import { hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";

let mobs = [];

export function trackSeaCreaturesHp() {
    if (!settings.seaCreaturesHpOverlay || !isInSkyblock() || !hasFishingRodInHotbar()) {
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

export function renderHpOverlay() {
    if (!settings.seaCreaturesHpOverlay || !mobs.length || !isInSkyblock() || !hasFishingRodInHotbar()) {
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
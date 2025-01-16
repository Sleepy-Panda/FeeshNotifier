import settings from "../../settings";
import { BOLD, YELLOW } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/common";
import { EntityArmorStand } from "../../constants/javaTypes";
import { overlayCoordsData } from "../../data/overlayCoords";

let mobs = [];

export function trackJawbusAndThunderHp() {
    if (!settings.seaCreaturesHpOverlay || !isInSkyblock()) {
        return;
    }

    mobs = [];
    const entities = World.getAllEntitiesOfType(EntityArmorStand);

	entities.forEach(entity => {
        const name = entity?.getName();

        if (name.includes('Lord Jawbus') || name.includes('Thunder')) {
            mobs.push(name);
        }
    })	
}

export function renderHpOverlay() {
    if (!settings.seaCreaturesHpOverlay || !mobs.length || !isInSkyblock()) {
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
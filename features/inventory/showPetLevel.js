import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";

registerIf(
    register('renderItemIntoGui', (item, x, y, event) => showPetLevel(item, x, y)),
    () => settings.showPetLevel && isInSkyblock()
);

function showPetLevel(item, x, y) {
    if (!settings.showPetLevel || !isInSkyblock()) {
        return;
    }

    if (!item) {
        return;
    }

    const displayName = item.getName();
    const name = displayName?.removeFormatting();
    if (!name || !name.includes('[Lvl')) {
        return;
    }

    const nbtId = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getString('id');
    if (!nbtId || nbtId !== 'PET') {
        return;
    }

    const level = name.split('[')[1].split(']')[0].slice(4);
    const color = displayName?.split('] ').pop().slice(0, 2);

    Tessellator.pushMatrix();
    Tessellator.disableLighting();

    Renderer.translate(x, y - 1, 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(0.7, 0.7);
    Renderer.drawString(color + level, 0, 16, true);

    Tessellator.enableLighting();
    Tessellator.popMatrix();
}
import settings from "../../settings";
import { AQUA } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";
import { getCleanItemName } from "../../utils/common";
import { registerIf } from "../../utils/registers";

const MAX_PROGRESS_SECONDS = 300 * 60 * 60;

//registerIf(
//    register('renderItemIntoGui', (item, x, y, event) => showMobyDuckProgress(item, x, y)),
//    () => settings.showMobyDuckProgress && isInSkyblock()
//);

function showMobyDuckProgress(item, x, y) {
    if (!item || !settings.showMobyDuckProgress || !isInSkyblock()) return;

    const name = getCleanItemName(item.getName());
    if (name !== 'Moby-Duck') return;

    const progressSeconds = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getInteger('seconds_held');
    if (!progressSeconds && progressSeconds !== 0) return;

    const displayString = Math.trunc(progressSeconds / MAX_PROGRESS_SECONDS * 100) + '%';

    Tessellator.pushMatrix();
    Tessellator.disableLighting();

    Renderer.translate(x, y - 1, 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(0.7, 0.7);
    Renderer.drawString(AQUA + displayString, 0, 16, true);

    Tessellator.enableLighting();
    Tessellator.popMatrix();
}
import settings from "../../../settings";
import { AQUA } from "../../../constants/formatting";
import { isInSkyblock } from "../../../utils/playerState";
import { getCleanItemName } from "../../../utils/common";

const MAX_PROGRESS_SECONDS = 300 * 60 * 60;

export function showMobyDuckProgress(item, x, y) {
    if (!item || !settings.showMobyDuckProgress || !isInSkyblock()) return;

    const name = getCleanItemName(item.getName());
    if (name !== 'Moby-Duck') return;

    const progressSeconds = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getInteger('seconds_held');
    if (!progressSeconds && progressSeconds !== 0) return;

    const displayString = Math.trunc(progressSeconds / MAX_PROGRESS_SECONDS * 100) + '%';

    return {
        text: AQUA + displayString,
        x: 0,
        y: 15,
        scale: 0.7
    };
}
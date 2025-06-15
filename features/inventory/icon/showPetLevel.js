import settings from "../../../settings";
import { isInSkyblock } from "../../../utils/playerState";

export function showPetLevel(item, x, y) {
    if (!item || !settings.showPetLevel || !isInSkyblock()) {
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

    return {
        text: color + level,
        x: 0,
        y: 15,
        scale: 0.7
    };
}
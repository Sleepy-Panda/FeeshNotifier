import { AQUA } from "../../constants/formatting";
import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { getCleanItemName, renderTextInSlot } from "../../utils/common";

const BOTTLES = [
    {
        name: 'Empty Thunder Bottle',
        maxCharge: 50000,
    },
    {
        name: 'Empty Storm Bottle',
        maxCharge: 500000,
    },
    {
        name: 'Empty Hurricane Bottle',
        maxCharge: 5000000,
    },
];

export function showThunderBottleProgress(item, x, y) {
    if (!item || !settings.showThunderBottleProgress || !isInSkyblock()) {
        return null;
    }

    const name = getCleanItemName(item.getName());
    let charge = null;

    if (BOTTLES.map(b => b.name).includes(name)) {
        const maxCharge = BOTTLES.find(b => b.name === name).maxCharge;
        const currentCharge = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getDouble('thunder_charge');

        if (currentCharge || currentCharge === 0) {
            charge = Math.trunc(currentCharge / maxCharge * 100);
        }
    }

    if (!charge && charge !== 0) {
        return null;
    }

    const displayString = AQUA + charge + '%';

    return {
        text: displayString,
        translateX: x,
        translateY: y - 1,
        x: 0,
        y: 16,
        scale: 0.7
    };
}
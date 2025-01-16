import { AQUA } from "../../constants/formatting";
import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";

register('renderItemIntoGui', (item, x, y, event) => {
    showThunderBottleProgress(item, x, y);
});

function showThunderBottleProgress(item, x, y) {
    if (!settings.showThunderBottleProgress || !isInSkyblock()) {
        return;
    }

    if (!item) {
        return;
    }

    const name = item.getName();
    if (!name.includes('Empty Thunder Bottle')) {
        return;
    }

    const charge = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getDouble('thunder_charge');
    if (!charge && charge !== 0) {
        return;
    }

    const maxCharge = 50000;
    const displayString = Math.trunc(charge / maxCharge * 100) + '%';

    Renderer.translate(x, y, 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(0.7, 0.7);
    Renderer.drawString(AQUA + displayString, 0, 16, true);
}
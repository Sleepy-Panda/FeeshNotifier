import { AQUA } from "../../constants/formatting";
import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { getCleanItemName } from "../../utils/common";
import { registerIf } from "../../utils/registers";

//registerIf(
//    register('renderItemIntoGui', (item, x, y, event) => showThunderBottleProgress(item, x, y)),
//    () => settings.showThunderBottleProgress && isInSkyblock()
//);

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

function showThunderBottleProgress(item, x, y) {
    if (!settings.showThunderBottleProgress || !isInSkyblock()) {
        return;
    }

    if (!item) {
        return;
    }

    const name = getCleanItemName(item.getName());

    if (!BOTTLES.map(b => b.name).includes(name)) {
        return;
    }

    const charge = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getDouble('thunder_charge');
    if (!charge && charge !== 0) {
        return;
    }

    const maxCharge = BOTTLES.find(b => b.name === name).maxCharge;
    const displayString = Math.trunc(charge / maxCharge * 100) + '%';

    Tessellator.pushMatrix();
    Tessellator.disableLighting();

    Renderer.translate(x, y - 1, 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(0.7, 0.7);
    Renderer.drawString(AQUA + displayString, 0, 16, true);

    Tessellator.enableLighting();
    Tessellator.popMatrix();
}
import { AQUA } from "../../constants/formatting";
import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { getCleanItemName } from "../../utils/common";
import { registerIf } from "../../utils/registers";


// THIS HAS A PROBLEM
// With items moved across single GUI
// Also 0% charge not rendered

const CACHED_ITEMS = new Map();

register("guiClosed", (gui) => {
    CACHED_ITEMS.clear();
});

registerIf(
    register('renderItemIntoGui', (item, x, y, event) => showThunderBottleProgress(item, x, y)),
    () => settings.showThunderBottleProgress && isInSkyblock()
);

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

    const cacheKey = x + ',' + y;
    let data = CACHED_ITEMS.get(cacheKey);

    if (!data) {
        const name = getCleanItemName(item.getName());
        let charge = null;

        if (BOTTLES.map(b => b.name).includes(name)) {
            const maxCharge = BOTTLES.find(b => b.name === name).maxCharge;
            const currentCharge = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getDouble('thunder_charge');

            if (currentCharge || currentCharge === 0) {
                charge = Math.trunc(currentCharge / maxCharge * 100);
            }
        }

        data = { name: name, charge: charge };
        CACHED_ITEMS.set(cacheKey, data);
        console.log('Record for ' + cacheKey);
    }

    const charge = data.charge;
    if (!charge) {
        return;
    }

    const displayString = AQUA + charge + '%';

    Tessellator.pushMatrix();
    Tessellator.disableLighting();

    Renderer.translate(x, y - 1, 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(0.7, 0.7);
    Renderer.drawString(displayString, 0, 16, true);

    Tessellator.enableLighting();
    Tessellator.popMatrix();
}
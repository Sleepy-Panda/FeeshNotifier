import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { getCleanItemName, renderTextInSlot } from "../../utils/common";
import { registerIf } from "../../utils/registers";
import { showThunderBottleProgress } from "./showThunderBottleProgress";
import { showAttributes } from "./showAttributes";

const CACHED_ITEMS = new Map();

registerIf(
    register("guiClosed", (gui) => {
        CACHED_ITEMS.clear();
        console.log('Clear on close')
    }),
    () => isRegisterEnabled()
);

registerIf(
    register("guiMouseRelease", (gui) => {
        CACHED_ITEMS.clear();
        console.log('Clear on release')
    }),
    () => isRegisterEnabled()
);

registerIf(
    register('renderItemIntoGui', (item, x, y, event) => render(item, x, y)),
    () => isRegisterEnabled()
);

function isRegisterEnabled() {
    return isInSkyblock() &&
        settings.showThunderBottleProgress ||
        (settings.showAttributesOnFishingGear || settings.showAttributesOnFishingRod || settings.showAttributesOnShard || settings.showAttributesOnEverythingElse);
}

function render(item, x, y) {
    if (!item || !isRegisterEnabled()) return;

    const cacheKey = /*item.getID() + ',' + */x + ',' + y;
    let data = CACHED_ITEMS.get(cacheKey);
    let renderInfo = null;

    if (!data) {
        renderInfo = showThunderBottleProgress(item, x, y);
        if (!renderInfo) renderInfo = showAttributes(item, x, y);
        data = { renderInfo: renderInfo };
        CACHED_ITEMS.set(cacheKey, data);
        console.log('Set ' + cacheKey + ' ' + JSON.stringify(data)); // TODO
    }

    if (data.renderInfo && data.renderInfo.text) {
        renderTextInSlot(data.renderInfo.text, data.renderInfo.translateX, data.renderInfo.translateY, data.renderInfo.x, data.renderInfo.y, data.renderInfo.scale);
    }
}
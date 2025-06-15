import settings from "../../../settings";
import { isInSkyblock } from "../../../utils/playerState";
import { renderTextInSlot } from "../../../utils/common";
import { registerIf } from "../../../utils/registers";
import { showThunderBottleProgress } from "./showThunderBottleProgress";
import { showAttributes } from "./showAttributes";
import { showExpBoostPercent } from "./showExpBoostPercentage";
import { showPetLevel } from "./showPetLevel";
import { showMobyDuckProgress } from "./showMobyDuckProgress";
import { showRarityUpgrade } from "./showRarityUpgrade";

const CACHED_ITEMS = new Map();

registerIf(
    register("guiClosed", (gui) => {
        CACHED_ITEMS.clear();
        console.log('Clear on close')
    }),
    () => isRegisterEnabled()
);

registerIf(
    register("guiMouseRelease", (gui) => { // When GUI clicked e.g. to move some items
        CACHED_ITEMS.clear();
        console.log('Clear on release')
    }),
    () => isRegisterEnabled()
);

registerIf(
    register("worldUnload", (gui) => {
        CACHED_ITEMS.clear();
        console.log('Clear on world unload')
    }),
    () => isRegisterEnabled()
);

registerIf(
    register('renderItemIntoGui', (item, x, y, event) => renderItemIcon(item, x, y)),
    () => isRegisterEnabled()
);

function isRegisterEnabled() {
    return isInSkyblock() &&
        settings.showThunderBottleProgress ||
        settings.showExpBoostPercentage ||
        settings.showPetLevel ||
        settings.showMobyDuckProgress ||
        settings.showRarityUpgrade ||
        (settings.showAttributesOnFishingGear || settings.showAttributesOnFishingRod || settings.showAttributesOnShard || settings.showAttributesOnEverythingElse);
}

function renderItemIcon(item, x, y) {
    if (!item || !isRegisterEnabled()) return;

    const cacheKey = item.getID() + ',' + x + ',' + y;
    let data = CACHED_ITEMS.get(cacheKey);
    let renderInfo = null;

    if (!data) {
        if (!renderInfo) renderInfo = showAttributes(item, x, y);
        if (!renderInfo) renderInfo = showThunderBottleProgress(item, x, y);
        if (!renderInfo) renderInfo = showExpBoostPercent(item, x, y);
        if (!renderInfo) renderInfo = showPetLevel(item, x, y);
        if (!renderInfo) renderInfo = showMobyDuckProgress(item, x, y);
        if (!renderInfo) renderInfo = showRarityUpgrade(item, x, y);

        data = { renderInfo: renderInfo };
        CACHED_ITEMS.set(cacheKey, data);
        console.log('Set ' + cacheKey + ' ' + JSON.stringify(data)); // TODO
    }

    if (data.renderInfo && data.renderInfo.text) {
        renderTextInSlot(data.renderInfo.text, x, y, data.renderInfo.x, data.renderInfo.y, data.renderInfo.scale);
    }
}
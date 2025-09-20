import settings from "../../settings";
import { addLineToLore, getItemCustomData } from "../../utils/common";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";

registerIf(
    register('itemTooltip', (lore, item) => showItemId(lore, item)),
    () => settings.showItemId && isInSkyblock()
);

function showItemId(lore, item) {
    if (!item || !isInSkyblock() || !settings.showItemId) return;

    const customData = getItemCustomData(item);
    if (!customData) return;

    const itemId = customData.id;
    if (!itemId) return;

    if (!lore.some(l => l.formattedText.includes('Skyblock ID:'))) {
        let newLore = lore.concat([ new TextComponent(`§r§6Skyblock ID: §r§7${itemId}`)]);
        item.setLore(newLore); // This causes weird displaying of old tooltip data
    }
}

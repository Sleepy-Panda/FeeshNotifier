import settings from "../../settings";
import { addLineToLore } from "../../utils/common";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";

registerIf(
    register('itemTooltip', (lore, item) => showItemId(item)),
    () => settings.showItemId && isInSkyblock()
);

function showItemId(item) {
    if (!item || !isInSkyblock() || !settings.showItemId) {
        return;
    }

    const itemId = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getString('id');
    if (!itemId) {
        return;
    }

    addLineToLore(item, `§r§6Skyblock ID: `, `§r§7${itemId}`);
}

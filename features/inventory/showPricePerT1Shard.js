import settings from "../../settings";
import { addLineToLore, getItemAttributes, toShortNumber } from "../../utils/common";
import { isInSkyblock } from "../../utils/playerState";
import { registerWhen } from "../../utils/registers";

registerWhen(
    register('itemTooltip', (lore, item) => {
        showPricePerT1Attribute(item);
    }),
    () => isInSkyblock() && settings.showPricePerT1Attribute
);

function showPricePerT1Attribute(item) {
    if (!item) {
        return;
    }

    const currentGui = Player.getContainer()?.getName()?.toLowerCase();
    if (!currentGui?.includes("auctions") && !currentGui?.includes("auction view") && !currentGui?.includes("confirm purchase")) {
        return;
    }

    if (item.getName()?.removeFormatting() !== 'Attribute Shard') {
        return;
    }

    const itemAttributes = getItemAttributes(item);
    if (!itemAttributes || !itemAttributes.length) {
        return;
    }

    const attributeLevel = itemAttributes[0]?.split(':').pop();
    if (!attributeLevel) {
        return;
    }

    const t1ShardsCount = Math.pow(2, attributeLevel - 1);
    const priceLine = item.getLore()?.find(loreLine => loreLine?.removeFormatting().startsWith('Buy it now: ') || loreLine?.removeFormatting().startsWith('Top bid: ') || loreLine?.removeFormatting().startsWith('Starting bid: '));

    if (!priceLine) {
        return;
    }

    const priceStr = priceLine.removeFormatting()?.replace(/[^0-9]/g, '');
    const pricePerT1Shard = Math.floor(+priceStr / t1ShardsCount);

    addLineToLore(item, `§r§6Price per T1 attribute: `, `§r§7${toShortNumber(pricePerT1Shard)} coins`);
}

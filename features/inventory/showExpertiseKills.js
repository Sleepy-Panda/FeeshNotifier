import settings from "../../settings";
import { addLineToLore, isFishingRod, toShortNumber } from "../../utils/common";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";

registerIf(
    register('itemTooltip', (lore, item) => showFishingRodExpertiseKills(item)),
    () => settings.showFishingRodExpertiseKills && isInSkyblock()
);

function showFishingRodExpertiseKills(item) {
    if (!item || !isInSkyblock() || !settings.showFishingRodExpertiseKills || !isFishingRod(item)) {
        return;
    }

    const nbtExtraAttributes = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes');
    if (!nbtExtraAttributes) {
        return;
    }

    const enchantments = nbtExtraAttributes.getCompoundTag('enchantments')?.toObject();
    if (!enchantments || !enchantments['expertise']) {
        return;
    }

    const expertise = nbtExtraAttributes.getInteger('expertise_kills');
    if (expertise || expertise === 0) {
        const isMaxed = expertise > 15000;
        addLineToLore(item, `§r§6Expertise kills: `, `§r§7${toShortNumber(expertise)} / 15K${isMaxed ? ' (Maxed)' : ''}`);
    }
}

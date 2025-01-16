import settings from "../../settings";
import { addLineToLore, isFishingRod, toShortNumber } from "../../utils/common";
import { isInSkyblock } from "../../utils/playerState";
import { registerWhen } from "../../utils/registers";

registerWhen(
    register('itemTooltip', (lore, item) => showFishingRodExpertiseKills(item)),
    () => isInSkyblock() && settings.showFishingRodExpertiseKills
);

function showFishingRodExpertiseKills(item) {
    if (!item || !isFishingRod(item)) {
        return;
    }

    const enchantments = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getCompoundTag('enchantments')?.toObject();
    if (!enchantments || !enchantments['expertise']) {
        return;
    }

    const expertise = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getInteger('expertise_kills');
    if (expertise || expertise === 0) {
        addLineToLore(item, `§r§6Expertise kills: `, `§r§7${toShortNumber(expertise)} / 15K`);
    }
}
import settings from "../../settings";
import { addLineToLore, isFishingRod, toShortNumber } from "../../utils/common";
import { isInSkyblock } from "../../utils/playerState";

register("itemTooltip", (lore, item) => {
    if (!item || !isInSkyblock() || !settings.showFishingRodExpertiseKills || !isFishingRod(item)) {
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
});

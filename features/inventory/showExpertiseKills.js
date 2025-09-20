import settings from "../../settings";
import { addLineToLore, getItemCustomData, isFishingRod, toShortNumber } from "../../utils/common";
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

    const customData = getItemCustomData(item);
    if (!customData) return;

    const enchantments = customData.enchantments;
    if (!enchantments || !enchantments['expertise']) return;

    const expertise = customData.expertise_kills;
    if (expertise || expertise === 0) {
        const isMaxed = expertise > 15000;
        addLineToLore(item, `§r§6Expertise kills: `, `§r§7${toShortNumber(expertise)} / 15K${isMaxed ? ' (Maxed)' : ''}`);
    }
}

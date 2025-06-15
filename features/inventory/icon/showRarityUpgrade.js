import { GOLD } from "../../../constants/formatting";
import settings from "../../../settings";
import { isInSkyblock } from "../../../utils/playerState";

export function showRarityUpgrade(item, x, y) {
    if (!item || !settings.showRarityUpgrade || !isInSkyblock()) {
        return;
    }

    const displayName = item.getName();
    const cleanName = displayName?.removeFormatting();
    if (!cleanName) {
        return;
    }

    const isFishingItem = (
        cleanName.includes('Ice Rod') ||
        cleanName.includes('Slug Boots') ||
        cleanName.includes('Moogma Leggings') ||
        cleanName.includes('Flaming Chestplate') ||
        cleanName.includes('Taurus Helmet') ||
        cleanName.includes('Blade of the Volcano') ||
        cleanName.includes('Staff of the Volcano') ||
        cleanName.includes('Fairy\'s') ||
        cleanName.includes('Squid Boots') ||
        cleanName.includes('Rabbit Hat') ||
        cleanName.includes('Water Hydra Head') ||
        cleanName.includes('Fish Affinity Talisman') ||
        cleanName.includes('Shredder') ||
        cleanName.includes('Lucky Hoof') ||
        cleanName.includes('Phantom Rod') ||
        cleanName.includes('Yeti Rod') ||
        cleanName.includes('Tiki Mask')
    );
    if (!isFishingItem) {
        return;
    }

    const isUpgraded = JSON.stringify(item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getInteger('rarity_upgrades'));
    if (+isUpgraded !== 1) {
        return;
    }

    return {
        text: GOLD + 'R',
        x: 0,
        y: 15,
        scale: 0.7
    };
}
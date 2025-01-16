import { GOLD } from "../../constants/formatting";
import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";

register('renderItemIntoGui', (item, x, y, event) => {
    showRarityUpgrade(item, x, y);
});

function showRarityUpgrade(item, x, y) {
    if (!settings.showRarityUpgrade || !isInSkyblock()) {
        return;
    }

    if (!item) {
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
        cleanName.includes('Yeti Rod')
    );
    if (!isFishingItem) {
        return;
    }

    const isUpgraded = JSON.stringify(item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getInteger('rarity_upgrades'));
    if (+isUpgraded !== 1) {
        return;
    }

    Renderer.translate(x, y, 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(0.7, 0.7);
    Renderer.drawString(GOLD + 'R', 16, 16, true);
}
import { GOLD } from "../../constants/formatting";
import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";

registerIf(
    register('renderItemIntoGui', (item, x, y, event) => showRarityUpgrade(item, x, y)),
    () => settings.showRarityUpgrade && isInSkyblock()
);

function showRarityUpgrade(item, x, y) {
    if (!settings.showRarityUpgrade || !isInSkyblock()) {
        return;
    }

    if (!item) {
        return;
    }

    const displayName = item.getName();
    const name = displayName?.removeFormatting();
    if (!name) {
        return;
    }

    const isFishingItem = (
        name.includes('Slug Boots') ||
        name.includes('Moogma Leggings') ||
        name.includes('Flaming Chestplate') ||
        name.includes('Taurus Helmet') ||
        name.includes('Blade of the Volcano') ||
        name.includes('Staff of the Volcano') ||
        name.includes('Fairy\'s') ||
        name.includes('Squid Boots') ||
        name.includes('Rabbit Hat') ||
        name.includes('Water Hydra Head') ||
        name.includes('Fish Affinity Talisman') ||
        name.includes('Lucky Hoof') ||
        name.includes('Tiki Mask')
    );
    if (!isFishingItem) {
        return;
    }

    const isUpgraded = JSON.stringify(item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getInteger('rarity_upgrades'));
    if (+isUpgraded !== 1) {
        return;
    }

    Tessellator.pushMatrix();
    Tessellator.disableLighting();
    
    Renderer.translate(x, y - 1, 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(0.7, 0.7);
    Renderer.drawString(GOLD + 'R', 16, 16, true);

    Tessellator.enableLighting();
    Tessellator.popMatrix();
}
import { GOLD } from "../../constants/formatting";
import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";

const CACHED_ITEMS = new (Java.type('java.util.WeakHashMap'))();

register("guiClosed", (gui) => {
    if (!gui) return;
    CACHED_ITEMS.clear();
    //ChatLib.chat('Cleared ');
});

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

    const stack = item.itemStack;
    if (!stack) return;

    let data = CACHED_ITEMS.get(stack);

    if (!data) {
        const displayName = item.getName();
        const rarityUpgrades = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getInteger('rarity_upgrades');
        data = { displayName: displayName, rarityUpgrades: rarityUpgrades };
        CACHED_ITEMS.put(stack, data);
    }

    const displayName = item.displayName;
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

    const isUpgraded = JSON.stringify(data.rarityUpgrades);
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
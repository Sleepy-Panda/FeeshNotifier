import { GOLD } from "../../constants/formatting";
import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { getCleanItemName, getItemCustomData } from "../../utils/common";
import { registerIf } from "../../utils/registers";
import { GuiChest, GuiInventory } from "../../constants/javaTypes";
import { renderTextInSlot } from "../../utils/rendering2d";

registerIf(
    register('postGuiRender', (mouseX, mouseY, gui, event) => showRarityUpgrade(gui)),
    () => settings.showRarityUpgrade && isInSkyblock()
);

function showRarityUpgrade(gui) {
    if (!settings.showRarityUpgrade || !isInSkyblock()) return;
    if (!gui) return;
    if (!(gui instanceof GuiChest) && !(gui instanceof GuiInventory)) return;

    const container = Player?.getContainer();
    if (!container) return;
    
    const containerSize = container.getSize();
    if (!containerSize) return;

    for (let slotIndex = 0; slotIndex < containerSize; slotIndex++) {
        const item = container.getStackInSlot(slotIndex);

        const name = getCleanItemName(item?.getName());
        if (!name) continue;

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
        if (!isFishingItem) continue;

        const customData = getItemCustomData(item);
        if (!customData) continue;

        const rarityUpgrades = customData.rarity_upgrades;
        if (+rarityUpgrades !== 1) continue;

        renderTextInSlot(Client.getMinecraft().currentScreen, slotIndex, GOLD + 'R', 0.7, 15);
    }
}
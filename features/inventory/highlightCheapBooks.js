import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";

export function highlightCheapBooks(slot, gui) {
    if (!settings.highlightCheapBooks || !isInSkyblock()) {
        return;
    }

    if (!(gui instanceof net.minecraft.client.gui.inventory.GuiChest) && !(gui instanceof net.minecraft.client.gui.inventory.GuiInventory)) {
        return;
    }

    // if (gui instanceof net.minecraft.client.gui.inventory.GuiChest) {
    //     const chestName = gui.field_147002_h.func_85151_d().func_145748_c_().text; // inventorySlots -> getLowerChestInventory() -> getDisplayName()
    //     if (!chestName.includes('SkyBlock Menu') && !chestName.includes('Ender Chest') && !chestName.includes('Storage') && !chestName.includes('Backpack') && !chestName.includes('Chest') && !chestName.includes('Bazaar')) {
    //         return;
    //     }
    // }

    const item = slot.getItem();

    if (!item) {
        return;
    }

    const name = item.getName();
    if (!name.includes('Enchanted Book')) {
        return;
    }

    const lore = item.getLore();
    const bookName = lore.length ? lore[1] : '';

    if (bookName.includes('Corruption') ||
        bookName.includes('Frail') ||
        bookName.includes('Lure') ||
        bookName.includes('Magnet') ||
        bookName.includes('Angler') ||
        bookName.includes('Spiked Hook')
    ) {
        Renderer.drawRect(Renderer.color(255, 0, 0, 100), slot.getDisplayX(), slot.getDisplayY(), 16, 16);
    }
}
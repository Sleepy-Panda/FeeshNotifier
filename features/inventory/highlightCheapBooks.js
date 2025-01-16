import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";

register('renderSlot', (slot, gui, event) => {
    highlightCheapBooks(slot, gui);
});

function highlightCheapBooks(slot, gui) {
    if (!settings.highlightCheapBooks || !isInSkyblock()) {
        return;
    }

    if (!(gui instanceof net.minecraft.client.gui.inventory.GuiChest) && !(gui instanceof net.minecraft.client.gui.inventory.GuiInventory)) {
        return;
    }

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
        Renderer.drawRect(Renderer.color(255, 0, 0, 150), slot.getDisplayX(), slot.getDisplayY(), 16, 16);
    }
}
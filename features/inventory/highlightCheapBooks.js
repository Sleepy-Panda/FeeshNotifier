import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";

const BOOK_NAMES_TO_HIGHLIGHT = [
    'CORRUPTION_1',
    'FRAIL_6',
    'LURE_6',
    'MAGNET_6',
    'ANGLER_6',
    'SPIKED_HOOK_6'
];

registerIf(
    register('renderSlot', (slot, gui, event) => highlightCheapBooks(slot, gui)),
    () => settings.highlightCheapBooks && isInSkyblock()
);

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

    const enchantments = item.getNBT()?.getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")?.getCompoundTag("enchantments")?.toObject();
    if (!enchantments) {
        return;
    }

    const firstEnchantmentName = Object.keys(enchantments)[0];
    const bookName = `${firstEnchantmentName?.toUpperCase()}_${enchantments[firstEnchantmentName]}`;

    if (BOOK_NAMES_TO_HIGHLIGHT.includes(bookName)) {
        Renderer.drawRect(Renderer.color(255, 0, 0, 150), slot.getDisplayX(), slot.getDisplayY(), 16, 16);
    }
}
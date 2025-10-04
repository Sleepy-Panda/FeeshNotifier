import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { GuiChest, GuiInventory } from "../../constants/javaTypes";
import { getItemCustomData } from "../../utils/common";
import { highlightSlot } from "../../utils/rendering2d";

const BOOK_NAMES_TO_HIGHLIGHT = [
    'CORRUPTION_1',
    'FRAIL_6',
    'LURE_6',
    'MAGNET_6',
    'ANGLER_6',
    'SPIKED_HOOK_6'
];
const COLOR = Renderer.color(255, 0, 0, 150);

registerIf(
    register('postGuiRender', (mouseX, mouseY, gui, event) => highlightCheapBooks(gui)),
    () => settings.highlightCheapBooks && isInSkyblock()
);

function highlightCheapBooks(gui) {
    if (!settings.highlightCheapBooks || !isInSkyblock()) return;
    if (!gui) return;
    if (!(gui instanceof GuiChest) && !(gui instanceof GuiInventory)) return;

    const container = Player?.getContainer();
    if (!container) return;
    
    const containerSize = container.getSize();
    if (!containerSize) return;

    for (let slotIndex = 0; slotIndex < containerSize; slotIndex++) {
        let item = container.getStackInSlot(slotIndex);
        let name = item?.getName();
        if (!name || !name.includes('Enchanted Book')) continue;

        let customData = getItemCustomData(item);
        if (!customData) continue;

        let enchantments = customData.enchantments;
        if (!enchantments) continue;
    
        let firstEnchantmentName = Object.keys(enchantments)[0];
        let bookName = `${firstEnchantmentName?.toUpperCase()}_${enchantments[firstEnchantmentName]}`;

        let slot = container.container?.func_75139_a(slotIndex); // func_75139_a => getSlot()
        if (!slot) continue;

        if (BOOK_NAMES_TO_HIGHLIGHT.includes(bookName)) {
           highlightSlot(gui, slot, COLOR);
        }    
    }
}
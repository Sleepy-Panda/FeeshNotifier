import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { GuiChest, GuiInventory, HandledScreen } from "../../constants/javaTypes";
import { getItemCustomData } from "../../utils/common";
import { highlightSlot } from "../../utils/2dRendering";

const BOOK_NAMES_TO_HIGHLIGHT = [
    'CORRUPTION_1',
    'FRAIL_6',
    'LURE_6',
    'MAGNET_6',
    'ANGLER_6',
    'SPIKED_HOOK_6'
];

registerIf(
    register('postGuiRender', (mouseX, mouseY, gui, event) => highlightCheapBooks(gui)),
    () => settings.highlightCheapBooks && isInSkyblock()
);

function highlightCheapBooks(gui) {
    if (!settings.highlightCheapBooks || !isInSkyblock() || !gui) return;

    if (!(gui instanceof GuiChest) && !(gui instanceof GuiInventory)) return;

    const container = Player?.getContainer();
    if (!container) return;
    
    const containerSize = container.getSize();
    if (!containerSize) return;

    for (let slotIndex = 0; slotIndex < containerSize; slotIndex++) {
        const item = container.getStackInSlot(slotIndex);
        const name = item?.getName();
        if (!name || !name.includes('Enchanted Book')) continue;

        const customData = getItemCustomData(item);
        if (!customData) continue;

        const enchantments = customData.enchantments;
        if (!enchantments) continue;
    
        const firstEnchantmentName = Object.keys(enchantments)[0];
        const bookName = `${firstEnchantmentName?.toUpperCase()}_${enchantments[firstEnchantmentName]}`;

        if (BOOK_NAMES_TO_HIGHLIGHT.includes(bookName)) {
           highlightSlot(Client.getMinecraft().currentScreen, slotIndex, Renderer.getColor(255, 0, 0, 150));
        }    
    }
}

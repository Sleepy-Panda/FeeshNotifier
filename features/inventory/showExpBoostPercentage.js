import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { getCleanItemName } from "../../utils/common";
import { registerIf } from "../../utils/registers";
import { GuiChest, GuiInventory } from "../../constants/javaTypes";
import { renderTextInSlot } from "../../utils/rendering2d";

registerIf(
    register('postGuiRender', (mouseX, mouseY, gui, event) => showExpBoostPercentage(gui)),
    () => settings.showExpBoostPercentage && isInSkyblock()
);

function showExpBoostPercentage(gui) {
    if (!settings.showExpBoostPercentage || !isInSkyblock()) return;
    if (!gui) return;
    if (!(gui instanceof GuiChest) && !(gui instanceof GuiInventory)) return;

    const container = Player?.getContainer();
    if (!container) return;
    
    const containerSize = container.getSize();
    if (!containerSize) return;

    for (let slotIndex = 0; slotIndex < containerSize; slotIndex++) {
        const item = container.getStackInSlot(slotIndex);
        if (!item) continue;

        const name = getCleanItemName(item.getName());
        if (!name.endsWith(' Exp Boost')) continue;

        const lore = item.getLore();
        const percentageLine = lore.find(line => line?.unformattedText?.startsWith('Gives +')); // §7§7Gives §a+20% §7pet exp for Fishing.
        if (!percentageLine) continue;

        const percentage = percentageLine.unformattedText?.split(' ')[1]?.replace('+', '');
        if (!percentage) continue;

        const rarityColorCode = lore.find(line => line?.unformattedText?.endsWith('PET ITEM'))?.formattedText?.substring(0, 4); // §r§f§lCOMMON PET ITEM
        console.log(lore.find(line => line?.unformattedText?.endsWith('PET ITEM'))?.formattedText)
        if (!rarityColorCode) continue;

        renderTextInSlot(Client.getMinecraft().currentScreen, slotIndex, rarityColorCode + percentage, 0.7);
    }
}
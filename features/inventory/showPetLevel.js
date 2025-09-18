import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { getItemCustomData } from "../../utils/common";
import { registerIf } from "../../utils/registers";
import { GuiChest, GuiInventory } from "../../constants/javaTypes";
import { renderTextInSlot } from "../../utils/rendering2d";
import { COMMON, EPIC, LEGENDARY, MYTHIC, UNCOMMON } from "../../constants/formatting";

registerIf(
    register('postGuiRender', (mouseX, mouseY, gui, event) => showPetLevel(gui)),
    () => settings.showPetLevel && isInSkyblock()
);

function showPetLevel(gui) {
    if (!settings.showPetLevel || !isInSkyblock()) return;
    if (!gui) return;
    if (!(gui instanceof GuiChest) && !(gui instanceof GuiInventory)) return;

    const container = Player?.getContainer();
    if (!container) return;
    
    const containerSize = container.getSize();
    if (!containerSize) return;

    for (let slotIndex = 0; slotIndex < containerSize; slotIndex++) {
        const item = container.getStackInSlot(slotIndex);
        if (!item) continue;

        const displayName = item.getName();
        const name = displayName?.removeFormatting();
        if (!name || !name.includes('[Lvl')) continue;

        const customData = getItemCustomData(item);
        if (!customData) continue;

        const nbtId = customData.id;
        if (!nbtId || nbtId !== 'PET') continue;

        const level = name.split('[')[1].split(']')[0].slice(4);
        const color = getColor(JSON.parse(customData.petInfo)?.tier);

        renderTextInSlot(Client.getMinecraft().currentScreen, slotIndex, color + level, 0.7);
    }
}

function getColor(nbtTier) {
    if (!nbtTier) return COMMON;

    switch (nbtTier.toLowerCase()) {
        case 'mythic': return MYTHIC;
        case 'legendary': return LEGENDARY;
        case 'epic': return EPIC;
        case 'uncommon': return UNCOMMON;
        case 'common': return COMMON;
        default: return COMMON;
    };
}
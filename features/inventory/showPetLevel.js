import { GOLD, GREEN } from "../../constants/formatting";
import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";

export function showPetLevel(slot, gui) {
    if (!settings.showPetLevel || !isInSkyblock()) {
        return;
    }

    if (!(gui instanceof net.minecraft.client.gui.inventory.GuiChest) && !(gui instanceof net.minecraft.client.gui.inventory.GuiInventory)) {
        return;
    }

    const item = slot.getItem();
    if (!item) {
        return;
    }

    const name = item.getName()?.removeFormatting();
    if (!name || !name.includes('[Lvl')) {
        return;
    }

    const loreLines = item.getLore();
    if (!loreLines) {
        return;
    }

    const nbtId = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getString('id');
    if (!nbtId || nbtId !== 'PET') {
        return;
    }

    const level = name.split(']')[0].slice(5); // Start from the 5th char of "[Lvl 200"
    const color = loreLines.some(line => line.includes('MAX LEVEL')) ? GREEN : GOLD;
    Renderer.translate(slot.getDisplayX(), slot.getDisplayY(), 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(0.7, 0.7);
    Renderer.drawString(color + level, 0, 16, true);
}
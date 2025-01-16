import { AQUA } from "../../constants/formatting";
import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";

export function showThunderBottleProgress(slot, gui) {
    if (!settings.showThunderBottleProgress || !isInSkyblock()) {
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
    if (!name.includes('Empty Thunder Bottle')) {
        return;
    }

    const charge = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getDouble('thunder_charge');
    if (!charge && charge !== 0) {
        return;
    }

    const maxCharge = 50000;
    const displayString = Math.trunc(charge / maxCharge * 100) + '%';

    Renderer.translate(slot.getDisplayX(), slot.getDisplayY(), 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(0.7, 0.7);
    Renderer.drawString(AQUA + displayString, 0, 16, true);
}
import { AQUA } from "../../constants/formatting";
import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { getCleanItemName, getItemCustomData } from "../../utils/common";
import { registerIf } from "../../utils/registers";
import { GuiChest, GuiInventory } from "../../constants/javaTypes";
import { renderTextInSlot } from "../../utils/2dRendering";

registerIf(
    register('postGuiRender', (mouseX, mouseY, gui, event) => showThunderBottleProgress(gui)),
    () => settings.showThunderBottleProgress && isInSkyblock()
);

const BOTTLES = [
    {
        name: 'Empty Thunder Bottle',
        maxCharge: 50000,
    },
    {
        name: 'Empty Storm Bottle',
        maxCharge: 500000,
    },
    {
        name: 'Empty Hurricane Bottle',
        maxCharge: 5000000,
    },
];

function showThunderBottleProgress(gui) {
    if (!settings.showThunderBottleProgress || !isInSkyblock()) return;
    if (!gui) return;
    if (!(gui instanceof GuiChest) && !(gui instanceof GuiInventory)) return;

    const container = Player?.getContainer();
    if (!container) return;
    
    const containerSize = container.getSize();
    if (!containerSize) return;

    for (let slotIndex = 0; slotIndex < containerSize; slotIndex++) {
        const item = container.getStackInSlot(slotIndex);
        const name = getCleanItemName(item?.getName());

        if (!BOTTLES.map(b => b.name).includes(name)) continue;
    
        const customData = getItemCustomData(item);
        if (!customData) continue;

        const charge = customData.thunder_charge;
        if (!charge && charge !== 0) return;
    
        const maxCharge = BOTTLES.find(b => b.name === name).maxCharge;
        const displayString = Math.trunc(charge / maxCharge * 100) + '%';
    
        renderTextInSlot(Client.getMinecraft().currentScreen, slotIndex, AQUA + displayString, 0.7);
    }
}
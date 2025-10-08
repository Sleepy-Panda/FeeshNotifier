import settings from "../../settings";
import { AQUA } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";
import { getCleanItemName, getItemCustomData } from "../../utils/common";
import { registerIf } from "../../utils/registers";
import { GuiChest, GuiInventory } from "../../constants/javaTypes";
import { renderTextInSlot } from "../../utils/rendering2d";

const MAX_PROGRESS_SECONDS = 300 * 60 * 60;

registerIf(
    register('postGuiRender', (mouseX, mouseY, gui, event) => showMobyDuckProgress(gui)),
    () => settings.showMobyDuckProgress && isInSkyblock()
);

function showMobyDuckProgress(gui) {
    if (!settings.showMobyDuckProgress || !isInSkyblock()) return;
    if (!gui) return;
    if (!(gui instanceof GuiChest) && !(gui instanceof GuiInventory)) return;

    const container = Player?.getContainer();
    if (!container) return;
    
    const containerSize = container.getSize();
    if (!containerSize) return;

    for (let slotIndex = 0; slotIndex < containerSize; slotIndex++) {
        const item = container.getStackInSlot(slotIndex);

        const name = getCleanItemName(item?.getName());
        if (name !== 'Moby-Duck') continue;
    
        const customData = getItemCustomData(item);
        if (!customData) continue;

        const progressSeconds = customData.seconds_held;
        if (!progressSeconds && progressSeconds !== 0) return;
    
        const displayString = Math.trunc(progressSeconds / MAX_PROGRESS_SECONDS * 100) + '%';
        renderTextInSlot(Client.getMinecraft().currentScreen, slotIndex, AQUA + displayString, 0.7, 15);
    }
}
import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { GuiChest } from "../../constants/javaTypes";
import { renderTextInSlot } from "../../utils/rendering2d";
import { AQUA, DARK_GRAY, GOLD, GRAY } from "../../constants/formatting";

registerIf(
    register('postGuiRender', (mouseX, mouseY, gui, event) => showCaughtTrophyFishRaritiesInOdger(gui)),
    () => settings.showCaughtTrophyFishRaritiesInOdger && isInSkyblock()
);

function showCaughtTrophyFishRaritiesInOdger(gui) {
    if (!settings.showCaughtTrophyFishRaritiesInOdger || !isInSkyblock()) return;
    if (!gui) return;
    if (!(gui instanceof GuiChest)) return;

    const chestName = gui.getTitle()?.getString()?.removeFormatting();
    if (!chestName || chestName !== 'Trophy Fishing') {
        return;
    }

    const container = Player?.getContainer();
    if (!container) return;
    
    const containerSize = container.getSize();
    if (!containerSize) return;

    for (let slotIndex = 10; slotIndex < Math.min(containerSize, 46); slotIndex++) {
        const item = container.getStackInSlot(slotIndex);
        if (!item) continue;

        // Bronze ✖, Bronze ✔
        let caughtRarities = '';
        const lore = item.getLore();

        if (lore?.find(line => line?.unformattedText?.includes('Undiscovered'))) {
            continue;
        }

        if (lore?.find(line => line?.unformattedText?.includes('Bronze ✔'))) caughtRarities += `${DARK_GRAY}•`;
        if (lore?.find(line => line?.unformattedText?.includes('Silver ✔'))) caughtRarities += `${GRAY}•`;
        if (lore?.find(line => line?.unformattedText?.includes('Gold ✔'))) caughtRarities += `${GOLD}•`;
        if (lore?.find(line => line?.unformattedText?.includes('Diamond ✔'))) caughtRarities += `${AQUA}•`;

        if (caughtRarities) {
            renderTextInSlot(Client.getMinecraft().currentScreen, slotIndex, caughtRarities, 1.3, -3);
        }
    }
}
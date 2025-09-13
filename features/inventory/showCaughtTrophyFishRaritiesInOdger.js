
import { AQUA, DARK_GRAY, GOLD, GRAY } from "../../constants/formatting";
import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";

//registerIf(
//    register('renderSlot', (slot, gui, event) => showMissingTrophyFishRarities(slot, gui)),
//    () => settings.showCaughtTrophyFishRaritiesInOdger && isInSkyblock()
//);

function showMissingTrophyFishRarities(slot, gui) {
    if (!slot || !gui || !(gui instanceof net.minecraft.client.gui.inventory.GuiChest) || !settings.showCaughtTrophyFishRaritiesInOdger || !isInSkyblock()) {
        return;
    }

    const chestName = gui?.field_147002_h?.func_85151_d()?.func_145748_c_()?.text?.removeFormatting();
    if (!chestName || chestName !== 'Trophy Fishing') {
        return;
    }

    if (slot.getIndex() < 10 || slot.getIndex() > 45) {
        return;
    }

    const item = slot.getItem();
    if (!item) {
        return;
    }

    // Bronze ✖, Bronze ✔
    let caughtRarities = '';
    const lore = item.getLore();

    if (lore?.find(line => line?.unformattedText?.includes('Undiscovered'))) {
        return;
    }

    if (lore?.find(line => line?.unformattedText?.includes('Bronze ✔'))) caughtRarities += `${DARK_GRAY}•`;
    if (lore?.find(line => line?.unformattedText?.includes('Silver ✔'))) caughtRarities += `${GRAY}•`;
    if (lore?.find(line => line?.unformattedText?.includes('Gold ✔'))) caughtRarities += `${GOLD}•`;
    if (lore?.find(line => line?.unformattedText?.includes('Diamond ✔'))) caughtRarities += `${AQUA}•`;

    Tessellator.pushMatrix();
    Tessellator.disableLighting();

    Renderer.translate(slot.getDisplayX(), slot.getDisplayY(), 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(1.3, 1.3);
    Renderer.drawString(caughtRarities, 0, 8, true);

    Tessellator.enableLighting();
    Tessellator.popMatrix();
}
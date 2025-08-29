import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";
import { getCleanItemName, getLore } from "../../utils/common";
import { registerIf } from "../../utils/registers";

//registerIf(
//    register('renderItemIntoGui', (item, x, y, event) => showExpBoostPercent(item, x, y)),
//    () => settings.showExpBoostPercentage && isInSkyblock()
//);

// Exp Boost NBT:
// {"ench":[],"HideFlags":254,"display":{"Lore":["§8Consumed on use","","§aPet Items §7can boost pets in many powerful ways!","§7A pet can only hold one §aPet Item §7at a time.","§7The pet must be §evisible §7to apply the item!","","§7§7Gives §a+40% §7pet exp for Fishing.","","§7§eRight-click on your summoned pet to","§egive it this item!","","§9§lRARE PET ITEM"],"Name":"§9Fishing Exp Boost"},"ExtraAttributes":{"id":"PET_ITEM_FISHING_SKILL_BOOST_RARE","uuid":"92d3d59a-bab8-4ead-833f-9f72ee31e6f5","timestamp":1741679190890}}
// {"ench":[],"HideFlags":254,"display":{"Lore":["§8Consumed on use","","§aPet Items §7can boost pets in many powerful ways!","§7A pet can only hold one §aPet Item §7at a time.","§7The pet must be §evisible §7to apply the item!","","§7§7Gives §a+20% §7pet exp for Fishing.","","§7§eRight-click on your summoned pet to","§egive it this item!","","§f§lCOMMON PET ITEM","","§7Cost","§658,200 Coins","","§eClick to trade!"],"Name":"§fFishing Exp Boost"},"ExtraAttributes":{"id":"PET_ITEM_FISHING_SKILL_BOOST_COMMON","uuid":"1293780f-cda9-464e-b8ee-824ae05f2d09","timestamp":1741702670362}}

function showExpBoostPercent(item, x, y) {
    if (!item || !settings.showExpBoostPercentage || !isInSkyblock()) {
        return;
    }

    const name = getCleanItemName(item.getName());
    if (!name.endsWith(' Exp Boost')) {
        return;
    }

    const lore = getLore(item);
    const percentageLine = lore.find(line => line?.removeFormatting()?.startsWith('Gives +')); // §7§7Gives §a+20% §7pet exp for Fishing.
    if (!percentageLine) {
        return;
    }

    const percentage = percentageLine.removeFormatting()?.split(' ')[1]?.replace('+', '');
    const rarityColorCode = lore.find(line => line?.endsWith('PET ITEM'))?.substring(0, 2); // §f§lCOMMON PET ITEM

    if (!percentage || !rarityColorCode) {
        return;
    }

    Tessellator.pushMatrix();
    Tessellator.disableLighting();

    Renderer.translate(x, y - 1, 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(0.7, 0.7);
    Renderer.drawString(rarityColorCode + percentage, 0, 16, true);

    Tessellator.enableLighting();
    Tessellator.popMatrix();
}
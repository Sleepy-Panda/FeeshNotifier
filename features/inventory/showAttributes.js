import settings from "../../settings";
import { BOLD, GRAY } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";
import { getItemAttributes, getLore } from "../../utils/common";
import { registerIf } from "../../utils/registers";

let ignoredItemNames = [];

setIgnoredItemNames();

settings.getConfig().onCloseGui(() => {
    setIgnoredItemNames();
});

//registerIf(
//    register('renderItemIntoGui', (item, x, y, event) => showAttributes(item, x, y)),
//    () => settings.showObsoleteAttributes && isInSkyblock()
//);

function showAttributes(item, x, y) {
    if (!item || !settings.showObsoleteAttributes || !isInSkyblock()) {
        return;
    }

    const name = item.getName()?.removeFormatting();
    if (!name || name === 'AUCTION FOR ITEM:') {
        return;
    }

    if (ignoredItemNames.length) {
        if (ignoredItemNames.some(itemName => name.toLowerCase().includes(itemName.toLowerCase().trim()))) return;
    }

    const lore = getLore(item);
    if ((item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getString('id') === 'ATTRIBUTE_SHARD' && name !== 'Attribute Shard') ||
        lore.find(l => l.removeFormatting().toLowerCase().includes('shard ('))
    ) { 
        return;
    }

    const attributeAbbreviations = getAttributeAbbreviations(item, GRAY + BOLD);
    if (!attributeAbbreviations) return;
    renderTextInSlot(x, y + 1, 0.5, attributeAbbreviations);
}

function getAttributeAbbreviations(item, lineFormat) {
    const itemAttributes = getItemAttributes(item);
    if (!itemAttributes || !itemAttributes.length) return;

    let attributeAbbreviations = [];
    itemAttributes.forEach(attribute => {
        const attributeAbbreviation = getAttributeAbbreviation(attribute);
        attributeAbbreviations.push(lineFormat + attributeAbbreviation);
    });

    return attributeAbbreviations.join(`\n`);

    function getAttributeAbbreviation(attribute) {
        const attributeAbbreviation = attribute.attributeCode
            .split('_', 3)
            .map(a => a === 'veteran'
                ? 'Ve'
                : (a === 'vitality' ? 'Vi' : a.substring(0, 1).toUpperCase()))
            .join('');
        return `${attributeAbbreviation}${attribute.attributeLevel}`;
    }
}

function renderTextInSlot(x, y, scale, text) {
    Tessellator.pushMatrix();
    Tessellator.disableLighting();

    Renderer.translate(x, y, 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(scale, scale);
    Renderer.drawString(text, 0, 0, true);

    Tessellator.enableLighting();
    Tessellator.popMatrix();
}

function setIgnoredItemNames() {
    if (settings.showAttributesIgnoredItems) {
        const itemNames = settings.showAttributesIgnoredItems.split(',').filter(i => !!i);
        ignoredItemNames = itemNames;
        return;
    }

    ignoredItemNames = [];
}
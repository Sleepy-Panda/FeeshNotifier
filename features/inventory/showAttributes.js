import settings from "../../settings";
import { BOLD, GRAY } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";
import { getItemAttributes, getItemCustomData } from "../../utils/common";
import { registerIf } from "../../utils/registers";
import { GuiChest, GuiInventory } from "../../constants/javaTypes";
import { renderTextInSlot } from "../../utils/rendering2d";

let ignoredItemNames = [];

setIgnoredItemNames();

settings.getConfig().onCloseGui(() => {
    setIgnoredItemNames();
});

registerIf(
    register('postGuiRender', (mouseX, mouseY, gui, event) => showAttributes(gui)),
    () => settings.showObsoleteAttributes && isInSkyblock()
);

function showAttributes(gui) {
    if (!settings.showObsoleteAttributes || !isInSkyblock()) return;
    if (!gui) return;
    if (!(gui instanceof GuiChest) && !(gui instanceof GuiInventory)) return;

    const container = Player?.getContainer();
    if (!container) return;
    
    const containerSize = container.getSize();
    if (!containerSize) return;

    for (let slotIndex = 0; slotIndex < containerSize; slotIndex++) {
        const item = container.getStackInSlot(slotIndex);
        if (!item) continue;

        const name = item.getName()?.removeFormatting();
        if (!name || name === 'AUCTION FOR ITEM:') continue;

        if (ignoredItemNames.length) {
            if (ignoredItemNames.some(itemName => name.toLowerCase().includes(itemName.toLowerCase().trim()))) continue;
        }

        const lore = item.getLore();
        const customData = getItemCustomData(item);

        if ((customData?.id === 'ATTRIBUTE_SHARD' && name !== 'Attribute Shard') ||
            lore.find(l => l.unformattedText.toLowerCase().includes('shard ('))
        ) { 
            continue;
        }

        const attributeAbbreviations = getAttributeAbbreviations(item, GRAY + BOLD);
        if (!attributeAbbreviations) continue;

        renderTextInSlot(gui, slotIndex, attributeAbbreviations, 0.5);
    }
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


function setIgnoredItemNames() {
    if (settings.showAttributesIgnoredItems) {
        const itemNames = settings.showAttributesIgnoredItems.split(',').filter(i => !!i);
        ignoredItemNames = itemNames;
        return;
    }

    ignoredItemNames = [];
}
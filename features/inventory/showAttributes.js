import settings from "../../settings";
import { BOLD, GREEN, WHITE } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";
import { getItemAttributes } from "../../utils/common";
import { registerIf } from "../../utils/registers";

const CACHED_ITEMS = new (Java.type('java.util.WeakHashMap'))();

register("guiClosed", (gui) => {
    if (!gui) return;
    CACHED_ITEMS.clear();
    //ChatLib.chat('Cleared ');
});

registerIf(
    register('renderItemIntoGui', (item, x, y, event) => showAttributes(item, x, y)),
    () => (settings.showAttributesOnFishingGear || settings.showAttributesOnFishingRod || settings.showAttributesOnShard || settings.showAttributesOnEverythingElse) && isInSkyblock()
);

const FISHING_GEAR_REGEX = /(Thunder|Thunderbolt|Magma Lord|Slug|Moogma|Flaming|Taurus) (Helmet|Chestplate|Leggings|Boots|Gauntlet|Necklace)/;

function showAttributes(item, x, y) {
    if (!item || (!settings.showAttributesOnFishingGear && !settings.showAttributesOnFishingRod && !settings.showAttributesOnShard && !settings.showAttributesOnEverythingElse) || !isInSkyblock()) {
        return;
    }

    // let isInChest = Client.isInGui() && Client.currentGui?.getClassName() === 'GuiChest';
    // if (!isInChest) return;
    
    const stack = item.itemStack;
    if (!stack) return;

    let data = CACHED_ITEMS.get(stack);

    if (!data) {
        const name = item.getName()?.removeFormatting();
        const itemAttributes = getItemAttributes(item);
        data = { name: name, itemAttributes: itemAttributes };
        CACHED_ITEMS.put(stack, data);
        console.log('Added entry for ' + name + stack.toString())
    }

    const name = data.name;
    if (!name || name === 'AUCTION FOR ITEM:') {
        return;
    }

    let highlightedAttributeCodesString = '';

    if (name === 'Attribute Shard') {
        if (!settings.showAttributesOnShard) return;
        highlightedAttributeCodesString = settings.accentedAttributesOnShard || '';
    } else if (isLavaFishingRod(name)) {
        if (!settings.showAttributesOnFishingRod) return;
        highlightedAttributeCodesString = settings.accentedAttributesOnFishingRod || '';
    } else if (FISHING_GEAR_REGEX.test(name)) {
        if (!settings.showAttributesOnFishingGear) return;
        highlightedAttributeCodesString = settings.accentedAttributesOnFishingGear || '';
    } else if (settings.showAttributesOnEverythingElse) {
        highlightedAttributeCodesString = settings.accentedAttributesOnEverythingElse || '';
    } else {
        return;
    }

    const highlightedAttributeCodes = highlightedAttributeCodesString.split(',');

    const itemAttributes = data.itemAttributes;
    if (!itemAttributes || !itemAttributes.length) {
        return;
    }

    let attributeAbbreviations = [];
    itemAttributes.forEach(attribute => {
        const color = highlightedAttributeCodes.includes(attribute.attributeCode) ? GREEN + BOLD : WHITE + BOLD;
        const attributeAbbreviation = `${color}${getAttributeAbbreviation(attribute)}`;
        attributeAbbreviations.push(attributeAbbreviation);
    });

    const attributesString = attributeAbbreviations.join(`\n`);

    Tessellator.pushMatrix();
    Tessellator.disableLighting();

    Renderer.translate(x, y + 1, 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(0.5, 0.5);
    Renderer.drawString(attributesString, 0, 0, true);

    Tessellator.enableLighting();
    Tessellator.popMatrix();
}

function isLavaFishingRod(name) {
    return !!name && (name.includes('Magma Rod') || name.includes('Inferno Rod') || name.includes('Hellfire Rod'));
}

function getAttributeAbbreviation(attribute) {
    const attributeAbbreviation = attribute.attributeCode
        .split('_', 2)
        .map(a => a === 'veteran'
            ? 'Ve'
            : (a === 'vitality' ? 'Vi' : a.substring(0, 1).toUpperCase()))
        .join('');
    return `${attributeAbbreviation}${attribute.attributeLevel}`;
}
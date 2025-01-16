import { AQUA, BOLD, DARK_GREEN, GOLD, GREEN, WHITE } from "../../constants/formatting";
import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";

register('renderItemIntoGui', (item, x, y, event) => {
    showArmorAttributes(item, x, y);
});

function showArmorAttributes(item, x, y) {
    if (!settings.showArmorAttributes || !isInSkyblock()) {
        return;
    }

    if (!item) {
        return;
    }

    const thunderRegex = /Thunder (Helmet|Chestplate|Leggings|Boots)/;
    const magmaLordRegex = /Magma Lord (Helmet|Chestplate|Leggings|Boots|Gauntlet)/;

    const name = item.getName()?.removeFormatting();
    if (!name || (
        !name.includes('Thunderbolt Necklace') &&
        !thunderRegex.test(name) &&
        !magmaLordRegex.test(name) &&
        (!name.includes('Slug Boots') && !name.includes('Moogma Leggings') && !name.includes('Flaming Chestplate') && !name.includes('Taurus Helmet'))
    )) {
        return;
    }

    const loreLines = item.getLore();
    if (!loreLines) {
        return;
    }

    const attributes = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getCompoundTag('attributes')?.toObject();
    if (!attributes) {
        return;
    }

    let attributeAbbreviations = [];
    const highlightedAttributeCodesString = settings.accentedArmorAttributes || '';
    const highlightedAttributeCodes = highlightedAttributeCodesString.split(',');

    Object.keys(attributes).sort().forEach(attributeCode => {
        const attributeLevel = attributes[attributeCode];
        if (attributeCode === 'mending') {
            attributeCode = 'vitality';
        }
        const color = highlightedAttributeCodes.includes(attributeCode) ? GREEN + BOLD : WHITE + BOLD;
        const attributeAbbreviation = `${color}${attributeCode.split('_', 2).map(a => a.substring(0, 1).toUpperCase()).join('')}${attributeLevel}`;
        attributeAbbreviations.push(attributeAbbreviation);
    });

    const attributesString = attributeAbbreviations.join(`\n`);

    Renderer.translate(x, y, 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(0.5, 0.5);
    Renderer.drawString(attributesString, 0, 0, true);
}
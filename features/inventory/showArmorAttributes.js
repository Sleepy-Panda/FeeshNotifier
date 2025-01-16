import settings from "../../settings";
import { BOLD, GREEN, WHITE } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";

register('renderItemIntoGui', (item, x, y, event) => {
    showArmorAttributes(item, x, y);
});

const FISHING_GEAR_REGEX = /(Thunder|Thunderbolt|Magma Lord|Slug|Moogma|Flaming|Taurus) (Helmet|Chestplate|Leggings|Boots|Gauntlet|Necklace)/;
const CRIMSON_ARMOR_REGEX = /(Crimson|Aurora|Terror|Fervor|Hollow|Berserker|Rampart) (Helmet|Chestplate|Leggings|Boots)/;
const CRIMSON_EQUIPMENT_REGEX = /Gauntlet of Contagion|Flaming Fist|((Molten|Implosion|Blaze|Scoville|Scourge|Delirium|Ghast|Lava Shell|Magma|Glowstone) (Cloak|Belt|Necklace|Gauntlet|Bracelet))/;

function showArmorAttributes(item, x, y) {
    if (!item || (!settings.showFishingArmorAttributes && !settings.showCrimsonArmorAttributes) || !isInSkyblock()) {
        return;
    }

    const name = item.getName()?.removeFormatting();
    if (!name) {
        return;
    }

    let isFishingGear = false;
    let isCrimsonGear = false;

    if (settings.showFishingArmorAttributes && FISHING_GEAR_REGEX.test(name)) {
        isFishingGear = true;
    } else if (settings.showCrimsonArmorAttributes && (CRIMSON_ARMOR_REGEX.test(name) || CRIMSON_EQUIPMENT_REGEX.test(name))) {
        isCrimsonGear = true;
    }

    if (!isFishingGear && !isCrimsonGear) {
        return;
    }

    const attributes = item.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getCompoundTag('attributes')?.toObject();
    if (!attributes) {
        return;
    }

    let attributeAbbreviations = [];
    const highlightedAttributeCodesString = isFishingGear ? (settings.accentedFishingArmorAttributes || '') : (settings.accentedCrimsonArmorAttributes || '');
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

    Tessellator.pushMatrix();
    Tessellator.disableLighting();

    Renderer.translate(x, y, 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(0.5, 0.5);
    Renderer.drawString(attributesString, 0, 0, true);

    Tessellator.enableLighting();
    Tessellator.popMatrix();
}